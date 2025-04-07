import React from "react";
import { Separator } from "../components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Github, Linkedin, Code, ExternalLink } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            About Game Finder
          </h1>
          <p className="text-muted-foreground">
            A portfolio project showcasing modern web development skills
          </p>
        </div>

        <Separator className="my-4" />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Project Overview</h2>
          <p>
            Game Finder is a web application that allows users to browse,
            search, and filter video games using the RAWG Video Games API. This
            portfolio project demonstrates my front-end development skills,
            React expertise, and ability to work with external APIs.
          </p>
          <p>
            Users can explore thousands of games, filter by platform and genre,
            search for specific titles, and create a wishlist of their favorite
            games.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">Technical Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Modern React Architecture:</span>{" "}
              Built with React 19, utilizing hooks, context, and modern
              patterns.
            </li>
            <li>
              <span className="font-medium">Feature-First Organization:</span>{" "}
              Code is organized by feature rather than type, improving
              scalability and maintenance.
            </li>
            <li>
              <span className="font-medium">State Management:</span> Uses React
              Query for server-state management with efficient caching and
              background updates.
            </li>
            <li>
              <span className="font-medium">Routing:</span> Implements React
              Router with URL-based filtering and pagination for shareable
              links.
            </li>
            <li>
              <span className="font-medium">UI Components:</span> Built with
              Shadcn UI and TailwindCSS for a responsive, accessible, and modern
              design.
            </li>
            <li>
              <span className="font-medium">API Integration:</span> Connects to
              the RAWG Video Games API to fetch game data, implementing proper
              error handling.
            </li>
            <li>
              <span className="font-medium">Animations:</span> Uses Framer
              Motion for smooth transitions and micro-interactions.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">For Employers</h2>
          <p>
            This project demonstrates my ability to build modern, responsive,
            and interactive web applications. I've focused on creating a clean,
            maintainable codebase using best practices and current industry
            standards.
          </p>
          <p>Key skills showcased in this project:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Modern React development with hooks and functional components
            </li>
            <li>Building responsive UIs with TailwindCSS</li>
            <li>State management with React Query</li>
            <li>Working with external APIs</li>
            <li>Implementing search, filtering, and pagination</li>
            <li>Creating a performant user experience</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">Connect With Me</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/wawrysiewiczj"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
            <a
              href="https://linkedin.com/in/jakub-wawrysiewicz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </a>
            <a
              href="https://www.webbyj.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Portfolio
              </Button>
            </a>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">Technical Credits</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <a
                href="https://rawg.io/apidocs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                RAWG Video Games API
              </a>{" "}
              - Game data and images
            </li>
            <li>
              <a
                href="https://ui.shadcn.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                Shadcn UI
              </a>{" "}
              - UI component library
            </li>
            <li>
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                TailwindCSS
              </a>{" "}
              - Utility-first CSS framework
            </li>
            <li>
              <a
                href="https://tanstack.com/query/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                TanStack Query
              </a>{" "}
              - Data fetching and server state management
            </li>
          </ul>
        </section>

        <section className="flex justify-center py-8">
          <Link to="/">
            <Button className="gap-2">
              <Code className="h-5 w-5" />
              Explore Game Finder
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
