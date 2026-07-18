"use client";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { studentSchema } from "@/lib/validations/student.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";

export default function EnrollStudentPage() {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: "",
    rollNumber: "",
    class: "",
    section: "",
    email: "",
    phone: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     console.log("Files selected:", e.target.files); 
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      console.log("New files array:", newFiles); 
      setPhotos((prev) => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // 1. Client-side validation (text fields only)
    const parsed = studentSchema.safeParse(formValues);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    // 2. Photos required check
    if (photos.length === 0) {
      setError("Please upload at least one photo");
      return;
    }

    setIsLoading(true);
    try {
      // 3. Build FormData (text fields + files)
      const data = new FormData();
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      photos.forEach((photo) => data.append("images", photo));

      // 4. Submit
      const res = await axios.post("/students", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Enrollment successful");
        router.push("/students");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(message);
        setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Enroll Student</CardTitle>
          <CardDescription>
            Add a new student along with their face photos for recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Roll Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-500">{fieldErrors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formValues.rollNumber}
                  onChange={handleChange}
                  placeholder="22BCS101"
                />
                {fieldErrors.rollNumber && (
                  <p className="text-sm text-red-500">{fieldErrors.rollNumber[0]}</p>
                )}
              </div>
            </div>

            {/* Class + Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  name="class"
                  value={formValues.class}
                  onChange={handleChange}
                  placeholder="CSE"
                />
                {fieldErrors.class && (
                  <p className="text-sm text-red-500">{fieldErrors.class[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section (optional)</Label>
                <Input
                  id="section"
                  name="section"
                  value={formValues.section}
                  onChange={handleChange}
                  placeholder="A"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Face Photos (3–5 recommended)</Label>
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg py-8 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload photos
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border border-border"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enrolling..." : "Enroll Student"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}