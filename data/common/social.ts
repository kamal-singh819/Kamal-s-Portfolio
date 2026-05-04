interface ISocialLink {
    label: string;
    href: string;
}
const githubURL = "https://github.com/kamal-singh819";
const linkedInURL = "https://www.linkedin.com/in/kamalsinghofficial/";
const leetcodeURL = "https://leetcode.com/TheKing45/";
const resumeURL = process.env.NEXT_PUBLIC_RESUME_URL ?? "https://drive.google.com/file/d/1Vn3Mplix4tR0chQN59BU02x9-SoR5C2K/view?usp=sharing";
export const phoneNumber = "+918192817091";
export const email = "singh540kamal@gmail.com";
export const emailLink = `mailto:${email}`;
export const phoneLink = `tel:${phoneNumber}`;

export const socialLinks: ISocialLink[] = [
    {
        label: "GitHub",
        href: githubURL
    },
    {
        label: "LinkedIn",
        href: linkedInURL
    },
    {
        label: "LeetCode",
        href: leetcodeURL
    },
    {
        label: "Resume",
        href: resumeURL
    }
];
