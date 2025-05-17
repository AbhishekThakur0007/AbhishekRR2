## OpenSearch GPT

A personalised AI search engine that learns about you and your interests as you browse the web.

It's like a perplexity / searchGPT clone, but for _you_.

![screenshot](https://opensearch-ai.pages.dev/screenshot.png)

### Powered by

- [Mem0](https://mem0.ai) - Automatic memory collection and retrival
- [Vercel AI ADK](https://github.com/vercel/ai) - A framework for building AI applications
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Shadcn UI](https://tailwindui.com/) - A set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS
- [Cobe](https://github.com/shuding/cobe) - Globe animation
- [GPT-4o-mini](https://openai.com)
- [Cloudflare Pages](https://pages.cloudflare.com/) - A platform for building and deploying web applications

Built by [Supermemory.ai](https://supermemory.ai) team.

## reVA-web - Real Estate Virtual Assistant

A personalized AI real estate assistant that helps users find their perfect property.

### Powered by

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - A set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS
- [Heygen API](https://www.heygen.com/) - AI-powered video generation for creating lifelike virtual assistants
- [GPT-4o-mini](https://openai.com) - Powering the conversational AI capabilities

### Features

- **Lifelike Virtual Agent**: Using Heygen API to create video responses with a virtual real estate agent
- **Voice Input**: Speech-to-text capabilities for natural interaction
- **Property Search**: Intelligent property search and filtering
- **Personalized Recommendations**: Custom property recommendations based on user preferences

### Environment Variables

You need to set up the following environment variables in your `.env.local` file:

```
NEXT_PUBLIC_HEYGEN_API_KEY=your_api_key_here
HEYGEN_API_KEY=your_api_key_here
```

The `HEYGEN_API_KEY` is used for server-side API calls (in the `/api/heygen` route), while the `NEXT_PUBLIC_` version is for client-side usage.

### Avatar Configuration

The application uses the Heygen API to generate videos with AI avatars. By default, it will:

1. Attempt to use a pre-defined avatar ID
2. If that fails, it will fetch the list of available avatars from your Heygen account
3. Select the first non-premium avatar available

You can modify this behavior in the `components/ai-chat.tsx` file.

Built by [Supermemory.ai](https://supermemory.ai) team.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment to both Vercel and Hetzner Cloud.

- **Automated Testing**: All code changes are automatically tested
- **Vercel Deployment**: Production deployments to Vercel on merges to main branch
- **Hetzner Cloud Deployment**: Automatic server provisioning and deployment on Hetzner Cloud

For setup instructions and required secrets, see [CI/CD Workflow Setup](.github/workflows/README.md)
