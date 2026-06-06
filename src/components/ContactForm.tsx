"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";

const HONEYPOT_FIELD = "website";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  function validate(): boolean {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido.";
    if (form.name.length > 100) newErrors.name = "Máximo 100 caracteres.";
    if (!form.email.trim()) newErrors.email = "El email es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email inválido.";
    if (!form.message.trim()) newErrors.message = "El mensaje es requerido.";
    if (form.message.length > 1000)
      newErrors.message = "Máximo 1000 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return; // honeypot triggered
    if (!validate()) return;

    // TODO: connect to email service (Resend, Formspree, etc.)
    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactanos</h2>

      {/* Honeypot - hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={HONEYPOT_FIELD}>No completar</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            required
            maxLength={1000}
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">
            {form.message.length}/1000
          </p>
          {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
        </div>

        {status === "success" && (
          <p role="alert" className="text-green-600 text-sm font-medium bg-green-50 rounded-lg px-4 py-2">
            ¡Mensaje enviado! Te respondemos a la brevedad.
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Enviar mensaje
        </button>
      </div>
    </form>
  );
}
