import {
  email,
  emailLink,
  phoneLink,
  phoneNumber,
  socialLinks
} from "@/data/common/social";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  return (
    <section className="space-y-4 border-t border-line pt-8">
      <SectionHeading
        title="Let's Build Something"
        description="Have an idea, an opening, or a product problem worth solving? I'd be happy to talk."
      />

      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition duration-200 hover:bg-ink hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-3 rounded-lg border border-line bg-zinc-50 p-4">
        <div className="flex items-center gap-3">
          <span className="font-medium text-zinc-500">Email:</span>
          <a href={emailLink} className="font-medium text-ink hover:underline">
            {email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-zinc-500">Phone:</span>
          <a href={phoneLink} className="font-medium text-ink hover:underline">
            {phoneNumber}
          </a>
        </div>
      </div>
    </section>
  );
}
