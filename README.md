# Vantage AI Group — Website

Marketing website for **Vantage AI Group** (AI Development & Consulting).

Static site — plain HTML, CSS, and vanilla JavaScript. No build step required.

## Structure

```
index.html        Single-page site (Home, About, Services, Voice Agents, Pricing, Booking, FAQ)
css/styles.css    Styles — white / light-silver theme with gold accents
js/main.js        Nav, scroll animations, booking form, voice-agent demos
assets/           Logo and hero image
```

## Sections

- **Home / Hero** — headline, CTAs, hero photo
- **About Us** — mission and values
- **Services** — AI strategy, custom development, automation, data & analytics, integration, support
- **Voice Agents** — five pre-built voice-agent cards with play-to-hear demos
- **Pricing** — tailored "custom quote" tiers that route to a free consultation
- **Booking** — free 30-minute consultation request form
- **FAQ** and footer

## Running locally

It's a static site — just open `index.html`, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- The booking form and voice-agent demos are front-end placeholders — wire them to a backend / real voice agents when ready.
- Contact email and social links are placeholders to be updated.
