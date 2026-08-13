<?php

namespace Tests\Feature;

use App\Models\Materi;
use App\Models\MateriKonten;
use App\Models\ProgramKursus;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class MateriFeatureTest extends TestCase
{
    use DatabaseTransactions;

    private User $admin;

    private ProgramKursus $program;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin Materi',
            'username' => 'adminmateri',
            'email' => 'adminmateri@example.com',
            'password' => bcrypt('Admin123!'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_AKTIF,
            'email_verified_at' => now(),
        ]);

        $this->program = ProgramKursus::create([
            'nama_program' => 'Program Materi Test',
            'slug' => 'program-materi-test',
            'tingkat' => 'pemula',
            'durasi_jam' => 10,
            'status' => 'aktif',
        ]);
    }

    public function test_admin_can_manage_materi_bab(): void
    {
        $this->actingAs($this->admin);

        $store = $this->post("/admin/programs/{$this->program->id}/materi", [
            'judul' => 'Bab Satu',
            'deskripsi' => 'Deskripsi bab satu',
            'estimasi_menit' => 30,
            'status' => 'aktif',
        ]);
        $store->assertRedirect();

        $materi = Materi::where('program_id', $this->program->id)->first();
        $this->assertNotNull($materi);
        $this->assertEquals('Bab Satu', $materi->judul);
        $this->assertEquals(1, $materi->urutan);
        $this->assertEquals(1, $this->program->fresh()->jumlah_materi);

        $this->patch("/admin/programs/{$this->program->id}/materi/{$materi->id}", [
            'judul' => 'Bab Satu (Revisi)',
            'estimasi_menit' => 45,
            'status' => 'draft',
        ])->assertRedirect();

        $this->assertEquals('Bab Satu (Revisi)', $materi->fresh()->judul);
        $this->assertEquals(45, $materi->fresh()->estimasi_menit);

        $this->delete("/admin/programs/{$this->program->id}/materi/{$materi->id}")->assertRedirect();
        $this->assertEquals(0, $this->program->fresh()->jumlah_materi);
    }

    public function test_admin_can_add_text_konten(): void
    {
        $this->actingAs($this->admin);
        $materi = Materi::create([
            'program_id' => $this->program->id,
            'judul' => 'Bab Teks',
            'slug' => 'bab-teks',
            'urutan' => 1,
            'estimasi_menit' => 10,
            'status' => 'aktif',
        ]);

        $this->post("/admin/programs/{$this->program->id}/materi/{$materi->id}/konten", [
            'tipe' => 'teks',
            'judul' => 'Pendahuluan',
            'konten' => "Assalamu'alaikum.\nSelamat belajar.",
        ])->assertRedirect();

        $konten = MateriKonten::where('materi_id', $materi->id)->first();
        $this->assertNotNull($konten);
        $this->assertEquals('teks', $konten->tipe);
        $this->assertEquals('Pendahuluan', $konten->judul);
        $this->assertEquals(1, $konten->urutan);
    }

    public function test_admin_can_upload_pdf_konten(): void
    {
        $this->actingAs($this->admin);
        $materi = Materi::create([
            'program_id' => $this->program->id,
            'judul' => 'Bab PDF',
            'slug' => 'bab-pdf',
            'urutan' => 1,
            'estimasi_menit' => 10,
            'status' => 'aktif',
        ]);

        $file = UploadedFile::fake()->create('materi.pdf', 100, 'application/pdf');

        $this->post("/admin/programs/{$this->program->id}/materi/{$materi->id}/konten", [
            'tipe' => 'pdf',
            'file' => $file,
        ])->assertRedirect();

        $konten = MateriKonten::where('materi_id', $materi->id)->first();
        $this->assertNotNull($konten);
        $this->assertEquals('pdf', $konten->tipe);
        $this->assertNotNull($konten->file_path);
        $this->assertStringContainsString('media/materi/', (string) $konten->media_url);
    }

    public function test_konten_requires_text_for_teks_tipe(): void
    {
        $this->actingAs($this->admin);
        $materi = Materi::create([
            'program_id' => $this->program->id,
            'judul' => 'Bab Kosong',
            'slug' => 'bab-kosong',
            'urutan' => 1,
            'estimasi_menit' => 10,
            'status' => 'aktif',
        ]);

        $this->post("/admin/programs/{$this->program->id}/materi/{$materi->id}/konten", [
            'tipe' => 'teks',
            'judul' => 'Tanpa Isi',
        ])->assertSessionHasErrors('error');

        $this->assertEquals(0, MateriKonten::where('materi_id', $materi->id)->count());
    }

    public function test_admin_can_move_and_delete_konten(): void
    {
        $this->actingAs($this->admin);
        $materi = Materi::create([
            'program_id' => $this->program->id,
            'judul' => 'Bab Urutan',
            'slug' => 'bab-urutan',
            'urutan' => 1,
            'estimasi_menit' => 10,
            'status' => 'aktif',
        ]);

        $a = MateriKonten::create(['materi_id' => $materi->id, 'tipe' => 'teks', 'konten' => 'A', 'urutan' => 1]);
        $b = MateriKonten::create(['materi_id' => $materi->id, 'tipe' => 'teks', 'konten' => 'B', 'urutan' => 2]);

        $this->post("/admin/programs/{$this->program->id}/materi/{$materi->id}/konten/{$b->id}/move/up")
            ->assertRedirect();

        $this->assertEquals(1, $b->fresh()->urutan);
        $this->assertEquals(2, $a->fresh()->urutan);

        $this->delete("/admin/programs/{$this->program->id}/materi/{$materi->id}/konten/{$b->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('materi_konten', ['id' => $b->id]);
    }

    public function test_admin_can_upload_bab_attachments(): void
    {
        $this->actingAs($this->admin);

        $gambar = UploadedFile::fake()->create('cover.png', 100, 'image/png');
        $pdf = UploadedFile::fake()->create('modul.pdf', 100, 'application/pdf');
        $video = UploadedFile::fake()->create('video.mp4', 1000, 'video/mp4');

        $this->post("/admin/programs/{$this->program->id}/materi", [
            'judul' => 'Bab Lampiran',
            'estimasi_menit' => 30,
            'status' => 'aktif',
            'gambar' => $gambar,
            'pdf' => $pdf,
            'video' => $video,
        ])->assertRedirect();

        $materi = Materi::where('program_id', $this->program->id)->first();
        $this->assertNotNull($materi);
        $this->assertNotNull($materi->gambar_path);
        $this->assertNotNull($materi->pdf_path);
        $this->assertNotNull($materi->video_path);
        $this->assertStringContainsString('media/materi/', (string) $materi->gambar_url);
        $this->assertStringContainsString('media/materi/', (string) $materi->pdf_url);
        $this->assertStringContainsString('media/materi/', (string) $materi->video_url);

        $this->patch("/admin/programs/{$this->program->id}/materi/{$materi->id}", [
            'judul' => 'Bab Lampiran',
            'remove_gambar' => '1',
        ])->assertRedirect();

        $this->assertNull($materi->fresh()->gambar_path);
        $this->assertNotNull($materi->fresh()->pdf_path);
    }

    public function test_admin_materi_index_renders(): void
    {
        $this->actingAs($this->admin);

        $this->get("/admin/programs/{$this->program->id}/materi")
            ->assertOk();
    }
}
