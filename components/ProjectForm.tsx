"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const ProjectForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState<string>("This project is amazing because it...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Dynamic Placeholder
  const placeholderText = [
    "e.g Uber for dogs",
    "e.g Facebook without AI posts",
    "e.g TikTok with no cringe",
    "e.g Google for conspiracy theories",
    "e.g Facebook with no ads",
    "e.g TikTok, but quieter",
    "e.g A dating app for introverts",
    "e.g Google for procrastinators",
    "e.g Uber, but for pizza",
    "e.g Instagram, but no filters",
    "e.g Netflix for memes",
    "e.g Snapchat for adults",
    "e.g A Tinder for dog lovers",
    "e.g TrustPilot for exorcists",
    "e.g Google for awkward moments",
    "e.g Facebook for conspiracy theorists",
    "e.g App that ends all wars",
    "e.g StackOverflow, but everyone is nice",
    "e.g Takealot, but appropriate box sizes",
    "e.g Uber Walk",
  ];

  const [placeholder, setPlaceholder] = useState<string>("e.g ");

  useEffect(() => {
    setPlaceholder(placeholderText[Math.floor(Math.random() * placeholderText.length)]);
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const formValues = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      link: formData.get("link") as string,
      pitch,
    };

    try {
      await formSchema.parseAsync(formValues);

      const result = await createPitch(formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your project pitch is ready for the world to see!",
        });
  
        router.push(`/project/${result._id}`);
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again",
          variant: "destructive",
        });
      }

      return result;

    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};

      for (const [key, messages] of Object.entries(error.formErrors?.fieldErrors || {})) {
        formattedErrors[key] = Array.isArray(messages) ? messages[0] : messages;
      }

      setErrors(formattedErrors);

      toast({
        title: "Error",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="project-form">
      <div>
        <label htmlFor="title" className="project-form_label">Title</label>
        <Input id="title" name="title" className="project-form_input" required placeholder={placeholder} />
        {errors.title && <p className="project-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="project-form_label">Description</label>
        <Textarea
          id="description"
          name="description"
          className="project-form_textarea"
          required
          placeholder="What It Do? (Briefly Explain Your Project)"
        />
        {errors.description && <p className="project-form_error">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="project-form_label">Category</label>
        <Input
          id="category"
          name="category"
          className="project-form_input"
          required
          placeholder="Choose a Category (e.g Health, Education, Transport)"
        />
        {errors.category && <p className="project-form_error">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="link" className="project-form_label">Image URL</label>
        <Input
          id="link"
          name="link"
          className="project-form_input"
          required
          placeholder="Paste a Link to Your Demo Or Some Media"
        />
        {errors.link && <p className="project-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="project-form_label">Pitch</label>
        <MDEditor
          value={pitch || ""}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your project and what your team needs...",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
          className="project-form_editor"
        />
        {errors.pitch && <p className="project-form_error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="project-form_btn text-white" disabled={isSubmitting}>
        {isSubmitting ? "Unleashing Your Brilliance..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ProjectForm;
