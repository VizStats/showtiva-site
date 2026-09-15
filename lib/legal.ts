// Copy for the legal pages. Plain data, so a client component can render it.
//
// Written to describe how ShowTiva actually works today — including what it
// does not do yet (no ads, no analytics, no payment processing) — so that
// nothing here promises or discloses something the product does not match.
// It is a starting draft: have it reviewed by a lawyer for the places ShowTiva
// operates before relying on it.
//
// Inline links use `[label](/href)`.

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  slug: "terms" | "privacy" | "cookies" | "ad-choices";
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  summary: string[];
  sections: LegalSection[];
}

export const LEGAL_NAV: { slug: LegalDoc["slug"]; label: string }[] = [
  { slug: "terms", label: "Terms of Use" },
  { slug: "privacy", label: "Privacy" },
  { slug: "cookies", label: "Cookies" },
  { slug: "ad-choices", label: "Ad Choices" },
];

const UPDATED = "15 September 2026";

/* ------------------------------------------------------------------ terms -- */

export const TERMS: LegalDoc = {
  slug: "terms",
  eyebrow: "Legal",
  title: "Terms of Use",
  description:
    "The agreement between you and ShowTiva when you watch, create an account or share work on the service. We have kept it as plain as we can.",
  updated: UPDATED,
  summary: [
    "ShowTiva is a family streaming service. Every title is chosen to sit at or below a PG-13 / TV-14 level.",
    "You are responsible for your account and for what happens under it. Keep your sign-in details to yourself.",
    "Watch for personal, non-commercial use. Do not copy, rip or re-upload what you see here.",
    "Creators keep ownership of their work and give us permission to show it on ShowTiva. See [Creators](/creators).",
  ],
  sections: [
    {
      id: "agreement",
      title: "Accepting these terms",
      blocks: [
        { type: "p", text: "By using ShowTiva — browsing, watching, creating an account or submitting work — you agree to these Terms of Use and to our [Privacy Policy](/privacy). If you do not agree, please do not use the service." },
        { type: "p", text: "If you use ShowTiva on behalf of a family, school or organisation, you confirm you are allowed to accept these terms for them." },
      ],
    },
    {
      id: "eligibility",
      title: "Who can use ShowTiva",
      blocks: [
        { type: "p", text: "ShowTiva is made for families, so people of all ages watch it. Accounts, though, are for adults:" },
        {
          type: "list",
          items: [
            "You must be 18 or older, or the age of majority where you live, to create an account.",
            "Children may watch under an account that belongs to a parent or guardian, who is responsible for how it is used.",
            "You must not use ShowTiva if you have been barred from it before or if the law where you live prohibits it.",
          ],
        },
      ],
    },
    {
      id: "account",
      title: "Your account",
      blocks: [
        { type: "p", text: "Give accurate details when you sign up and keep them current. You are responsible for everything that happens under your account, so keep your password private and tell us straight away through the [Contact](/contact) page if you think someone else has used it." },
        { type: "p", text: "We may ask you to confirm who you are before making changes to an account, to protect you." },
      ],
    },
    {
      id: "plans",
      title: "Plans and payment",
      blocks: [
        { type: "p", text: "Where ShowTiva offers a paid plan, the price, what it includes and how often you are billed are shown to you before you pay. By subscribing you authorise us, or our payment provider, to charge the method you choose for each billing period until you cancel." },
        {
          type: "list",
          items: [
            "You can cancel at any time; access continues until the end of the period you have already paid for.",
            "If a price changes, we will tell you in advance and the new price applies from your next billing period.",
            "Payments are not refundable for partly used periods, except where the law says otherwise.",
          ],
        },
      ],
    },
    {
      id: "content",
      title: "What you can watch",
      blocks: [
        { type: "p", text: "We pick every title on ShowTiva against a family-safe standard: films at or below PG-13, series at or below TV-14, with graphic horror, gratuitous violence and adult content left out. Ratings and descriptions are there to help you choose; please use them, especially for younger viewers." },
        { type: "p", text: "The catalog changes over time. Titles, seasons and features can be added or removed, and some may not be available everywhere." },
      ],
    },
    {
      id: "use",
      title: "Using the service properly",
      blocks: [
        { type: "p", text: "Your ShowTiva access is personal and non-commercial. When you use the service you agree not to:" },
        {
          type: "list",
          items: [
            "Download, record, copy, rebroadcast or re-upload content, except where a feature expressly lets you.",
            "Get around protections, geographic limits or age settings, or share your account outside your household.",
            "Scrape, crawl or use automated tools on the service, or interfere with how it runs.",
            "Post comments or upload material that is unlawful, hateful, harassing, sexual, or unsuitable for a family audience.",
            "Pretend to be someone else, or mislead people about who you are.",
          ],
        },
      ],
    },
    {
      id: "creators",
      title: "Creators and uploaded work",
      blocks: [
        { type: "p", text: "Creators join ShowTiva by invitation and after review — see [Creators](/creators). If you submit work to us:" },
        {
          type: "list",
          items: [
            "You keep ownership of it. You confirm that you own it, or have every permission needed, including from anyone who appears in it or contributed music or footage.",
            "You give ShowTiva a worldwide, non-exclusive licence to host, stream, adapt for different screens, and promote it on and around the service, for as long as it is published and for a reasonable time after to wind down.",
            "Your work must meet our family-safe standard. We may decline, edit for format, or remove work that does not.",
            "Any payment or revenue share is set out in a separate creator agreement, which takes priority over this section if the two differ.",
          ],
        },
      ],
    },
    {
      id: "ownership",
      title: "Our content and trademarks",
      blocks: [
        { type: "p", text: "ShowTiva, its logo, design and software, and the titles we license, are protected by copyright, trademark and other laws and belong to us or our licensors. These terms do not give you any right to use them beyond watching on the service." },
        { type: "p", text: "If you believe something on ShowTiva infringes your rights, tell us through the [Contact](/contact) page with enough detail for us to find it, and we will look into it promptly." },
      ],
    },
    {
      id: "ending",
      title: "Ending your access",
      blocks: [
        { type: "p", text: "You can stop using ShowTiva and close your account whenever you like. We may suspend or close an account that breaks these terms, puts others at risk, or where the law requires it. Where it is reasonable, we will tell you why and give you a chance to respond." },
      ],
    },
    {
      id: "liability",
      title: "Disclaimers and liability",
      blocks: [
        { type: "p", text: "We work hard to keep ShowTiva running and suitable for families, but the service is provided as it is and as available. We cannot promise it will always be uninterrupted or error-free." },
        { type: "p", text: "To the extent the law allows, ShowTiva is not liable for indirect or consequential losses, and our total liability to you is limited to the amount you paid us in the twelve months before the claim. Nothing in these terms limits rights you have as a consumer that cannot be limited by law." },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        { type: "p", text: "We may update these terms as the service grows. If a change is significant we will let you know before it takes effect, for example on the site or by email. The date at the top of this page shows when they last changed." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        { type: "p", text: "Questions about these terms? Reach us through the [Contact](/contact) page." },
      ],
    },
  ],
};

/* ---------------------------------------------------------------- privacy -- */

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  eyebrow: "Legal",
  title: "Privacy Policy",
  description:
    "What ShowTiva collects when you use it, why, who it is shared with, and the choices you have. Families trust us with their evenings; we take that seriously.",
  updated: UPDATED,
  summary: [
    "We collect what we need to run your account and play what you choose — and nothing we do not use.",
    "We never sell your personal information, and we do not show ads or build advertising profiles.",
    "We do not knowingly collect personal information from children. Accounts belong to adults.",
    "You can see, correct or delete your information at any time through the [Contact](/contact) page.",
  ],
  sections: [
    {
      id: "scope",
      title: "What this policy covers",
      blocks: [
        { type: "p", text: "This policy applies to ShowTiva's website and apps, and to anyone who browses, watches, creates an account or applies as a creator. It works alongside our [Terms of Use](/terms) and [Cookie Policy](/cookies)." },
      ],
    },
    {
      id: "provide",
      title: "Information you give us",
      blocks: [
        {
          type: "list",
          items: [
            "Account details — your name and email address when you sign up, and your password in protected form.",
            "Your activity choices — titles you save to your list, likes and comments on Shorts.",
            "Creator applications — portfolio links, a description of your work and how to reach you.",
            "Messages — anything you send us through the Contact page.",
          ],
        },
      ],
    },
    {
      id: "automatic",
      title: "Information collected automatically",
      blocks: [
        { type: "p", text: "When you use ShowTiva, some technical information is needed to deliver video to your screen and keep the service secure:" },
        {
          type: "list",
          items: [
            "Device and browser type, screen size and language, so pages and video fit your screen.",
            "Approximate location from your IP address, so we show titles licensed where you are.",
            "Playback information such as the quality chosen and where you paused, so you can pick up where you left off.",
            "A small number of cookies and local storage entries, listed in full in our [Cookie Policy](/cookies).",
          ],
        },
      ],
    },
    {
      id: "use",
      title: "How we use it",
      blocks: [
        {
          type: "list",
          items: [
            "To run your account, play titles and remember your list and settings.",
            "To keep the catalog family-safe and to review creator submissions.",
            "To keep ShowTiva secure, prevent abuse and fix problems.",
            "To tell you about changes to the service or your account. Marketing emails are optional, and every one has an unsubscribe link.",
          ],
        },
      ],
    },
    {
      id: "children",
      title: "Children and families",
      blocks: [
        { type: "p", text: "Children are welcome to watch ShowTiva with a parent or guardian, but accounts are for adults, and we do not knowingly collect personal information from children. If you believe a child has given us personal information, contact us and we will delete it." },
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      blocks: [
        { type: "p", text: "We do not sell or rent personal information. We share it only:" },
        {
          type: "list",
          items: [
            "With service providers who host the site, deliver video and send email for us, under contracts that limit them to that work.",
            "With creators, only in aggregate — for example how many people watched a title — never who you are.",
            "When the law requires it, or to protect the safety of our users or the public.",
            "If ShowTiva is part of a merger or sale, in which case this policy continues to protect your information.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Keeping it safe",
      blocks: [
        { type: "p", text: "We use encryption in transit, access controls and regular reviews to protect your information. No system is perfectly secure, so if something goes wrong we will tell you and the relevant authorities as the law requires." },
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      blocks: [
        { type: "p", text: "We keep account information while your account is open. When you close it, we delete or anonymise your personal information within 90 days, except for records we must keep for legal, tax or security reasons." },
      ],
    },
    {
      id: "rights",
      title: "Your choices and rights",
      blocks: [
        { type: "p", text: "Depending on where you live, you may have the right to:" },
        {
          type: "list",
          items: [
            "See the personal information we hold about you and get a copy.",
            "Correct anything that is wrong, or delete your information.",
            "Object to or limit certain uses, and withdraw consent you have given.",
            "Complain to your local data protection authority.",
          ],
        },
        { type: "note", text: "To use any of these rights, send a request through the [Contact](/contact) page. We will confirm it is you and respond within the time the law allows, usually 30 days." },
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      blocks: [
        { type: "p", text: "ShowTiva's providers may process information in countries other than yours. When they do, we use safeguards recognised by data protection law to keep it protected to the same standard." },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        { type: "p", text: "When we change this policy we will update the date at the top, and tell you in advance about any change that affects how your information is used." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        { type: "p", text: "For privacy questions or requests, reach us through the [Contact](/contact) page and choose Privacy." },
      ],
    },
  ],
};

/* ---------------------------------------------------------------- cookies -- */

export const COOKIES: LegalDoc = {
  slug: "cookies",
  eyebrow: "Legal",
  title: "Cookie Preferences",
  description:
    "The small files and browser storage ShowTiva uses, what each one does, and how to clear them. Right now the list is short, and none of it tracks you.",
  updated: UPDATED,
  summary: [
    "ShowTiva only uses storage it needs to work. There is nothing to switch off because nothing optional is on.",
    "No analytics, advertising or social-media tracking cookies are set.",
    "If that ever changes, we will ask for your permission first and add the controls here.",
  ],
  sections: [
    {
      id: "what",
      title: "What cookies are",
      blocks: [
        { type: "p", text: "Cookies are small text files a website saves in your browser. Local storage does a similar job inside the browser without being sent to the server. Both let a site remember things between pages and visits." },
      ],
    },
    {
      id: "list",
      title: "What ShowTiva stores",
      blocks: [
        { type: "p", text: "This is the complete list:" },
        {
          type: "table",
          head: ["Name", "Type", "What it does", "How long"],
          rows: [
            ["showtiva_intro_seen", "Cookie", "Remembers that you have seen today's intro, so you go straight to the catalog.", "Until midnight"],
            ["show-tiva-demo-auth", "Local storage", "Keeps you signed in on this device.", "Until you sign out"],
            ["show-tiva-demo-profile", "Local storage", "Remembers the name and email you signed in with, for your profile menu.", "Until you sign out"],
          ],
        },
        { type: "note", text: "All three are essential: without them ShowTiva would replay the intro on every visit and sign you out on every page. None are shared with anyone else." },
      ],
    },
    {
      id: "not-used",
      title: "What we do not use",
      blocks: [
        {
          type: "list",
          items: [
            "Analytics or measurement cookies.",
            "Advertising, retargeting or cross-site tracking cookies.",
            "Social media pixels or embedded trackers.",
          ],
        },
      ],
    },
    {
      id: "control",
      title: "Clearing or blocking them",
      blocks: [
        { type: "p", text: "You can delete ShowTiva's cookies and storage at any time in your browser settings, usually under Privacy or Site data. Signing out removes the two local storage entries straight away. If you block them, the intro will show on each visit and you will need to sign in again each time." },
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        { type: "p", text: "If we ever add optional cookies, such as analytics, we will ask for your consent before setting them and add switches to this page so you can change your mind. See our [Privacy Policy](/privacy) for how we handle your information more broadly." },
      ],
    },
  ],
};

/* ------------------------------------------------------------- ad choices -- */

export const AD_CHOICES: LegalDoc = {
  slug: "ad-choices",
  eyebrow: "Legal",
  title: "Ad Choices",
  description:
    "How advertising works on ShowTiva. The short answer is that it does not: there are no ads, and your viewing is never used to target you.",
  updated: UPDATED,
  summary: [
    "ShowTiva shows no advertising, before, during or after titles.",
    "We do not build interest profiles or share viewing activity with advertisers.",
    "Children's viewing will never be used for targeted advertising.",
  ],
  sections: [
    {
      id: "today",
      title: "Advertising today",
      blocks: [
        { type: "p", text: "There are no ads anywhere on ShowTiva — no pre-rolls, banners or sponsored rows — and no advertising partners receive information about what you watch." },
      ],
    },
    {
      id: "promotion",
      title: "Promotion inside ShowTiva",
      blocks: [
        { type: "p", text: "The banner on the catalog, the Trending Now and New Releases rows, and Shorts highlight titles that are already on ShowTiva. They are chosen by our team and by what is popular, not paid for by outside advertisers." },
      ],
    },
    {
      id: "future",
      title: "If that ever changes",
      blocks: [
        { type: "p", text: "Should ShowTiva introduce advertising, we commit to:" },
        {
          type: "list",
          items: [
            "Announcing it in advance and updating this page before any ad appears.",
            "Keeping every ad to the same family-safe standard as the catalog.",
            "Never using children's viewing for targeted ads.",
            "Asking for your consent before any personalised advertising, with a clear way to say no.",
          ],
        },
      ],
    },
    {
      id: "more",
      title: "More information",
      blocks: [
        { type: "p", text: "Read our [Privacy Policy](/privacy) and [Cookie Preferences](/cookies) for the full picture, or reach us through the [Contact](/contact) page." },
      ],
    },
  ],
};
