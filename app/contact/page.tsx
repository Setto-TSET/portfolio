import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/Motion";

export const metadata: Metadata = { title: "ติดต่อ" };

export default function Contact() {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal><p className="eyebrow">Contact</p></Reveal>
        <Reveal delay={0.08}><h1 className="title">มาคุยกันได้นะ, <span className="serif">say hi.</span></h1></Reveal>
        <Reveal delay={0.16}><p className="lead">เปิดรับงานฝึกงาน งานพาร์ทไทม์ และโปรเจกต์ที่น่าสนใจ</p></Reveal>
        <ContactForm />
      </div>
    </section>
  );
}
