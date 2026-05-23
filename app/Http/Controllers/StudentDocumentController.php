<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentDocumentController extends Controller
{
    public function store(Request $request, Student $student)
    {
        $validated = $request->validate([
            'document_type' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // max 10 MB
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($student, $validated, $request) {
                $file = $request->file('file');
                $path = $file->store('student-documents/' . $student->id, 'public');

                $student->documents()->create([
                    'document_type' => $validated['document_type'],
                    'file_path' => $path,
                    'original_file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'remarks' => $validated['remarks'] ?? null,
                ]);
            });

            return back()->with('success', 'Document uploaded successfully.');
        } catch (\Exception $e) {
            Log::error('Document upload failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to upload document.');
        }
    }

    public function update(Request $request, Student $student, StudentDocument $document)
    {
        if ($document->student_id !== $student->id) {
            abort(404);
        }

        $validated = $request->validate([
            'document_type' => 'required|string|max:255',
            'file'          => 'nullable|file|max:10240',
            'remarks'       => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($student, $document, $validated, $request) {
                // If a new file was uploaded, replace the old one
                if ($request->hasFile('file')) {
                    // Delete old file
                    Storage::disk('public')->delete($document->file_path);

                    $file = $request->file('file');
                    $newPath = $file->store('student-documents/' . $student->id, 'public');

                    $document->update([
                        'file_path'          => $newPath,
                        'original_file_name' => $file->getClientOriginalName(),
                        'mime_type'          => $file->getMimeType(),
                        'file_size'          => $file->getSize(),
                        'document_type'      => $validated['document_type'],
                        'remarks'            => $validated['remarks'] ?? $document->remarks,
                    ]);
                } else {
                    // Only update metadata
                    $document->update([
                        'document_type' => $validated['document_type'],
                        'remarks'       => $validated['remarks'] ?? $document->remarks,
                    ]);
                }
            });

            return back()->with('success', 'Document updated successfully.');
        } catch (\Exception $e) {
            Log::error('Document update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update document.');
        }
    }

    public function destroy(Student $student, StudentDocument $document)
    {
        if ($document->student_id !== $student->id) {
            abort(404);
        }

        try {
            Storage::disk('public')->delete($document->file_path);
            $document->delete();
            return back()->with('success', 'Document deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Document deletion failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete document.');
        }
    }

    public function verify(Student $student, StudentDocument $document)
    {
        if ($document->student_id !== $student->id) {
            abort(404);
        }

        $document->verify(auth()->user());
        return back()->with('success', 'Document verified.');
    }
}
