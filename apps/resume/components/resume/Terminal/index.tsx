'use client';
import { Resume } from '@/lib/resume';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './terminal.css';
import { useTypewriter } from './useTypewriter';

const BlinkingCursor = () => <span className="cursor"></span>;
const Divider = () => <p className="divider">------------------------------------------------------------</p>;

// Component for the currently animating command
const AnimatingCommand = ({ command, onFinished }: { command: string; onFinished: () => void; }) => {
    const typedCommand = useTypewriter(command, 20);
    const isCommandFinished = typedCommand === command;

    useEffect(() => {
        if (isCommandFinished) {
            const timer = setTimeout(onFinished, 300);
            return () => clearTimeout(timer);
        }
    }, [isCommandFinished, onFinished]);

    return (
        <div className="command-prompt">
            <span className="prompt-symbol">$&gt;</span>
            <span className="prompt-input">{typedCommand}</span>
            {!isCommandFinished && <BlinkingCursor />}
        </div>
    );
};

// Component for already completed commands
const StaticCommand = ({ command, children }: { command: string; children: React.ReactNode }) => (
    <div className="command-block static-command-wrapper">
        <div className="command-prompt">
            <span className="prompt-symbol">$&gt;</span>
            <span className="prompt-input">{command}</span>
        </div>
        <div className="command-output">{children}</div>
    </div>
);

const ResumeTerminal = ({ resume, locale }: { resume: Resume; locale: string; }) => {
  const { basics, work, skills, projects, education, languages } = resume.resumeData;
  const [commandStep, setCommandStep] = useState(0);

  const handleNextCommand = useCallback(() => {
    setCommandStep(s => s + 1);
  }, []);

  const commands = useMemo(() => [
    {
      command: `whoami --full-name`,
      output: (
        <>
          <p className="output-header-name">{basics?.name}</p>
          <p>{basics?.label}</p>
        </>
      )
    },
    {
      command: `cat /etc/contact.conf`,
      output: (
        <div className="output-contact">
            {basics?.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}
            {basics?.url && <a href={basics.url} target="_blank" rel="noopener noreferrer">{basics.url}</a>}
        </div>
      )
    },
    {
        command: `lsof -i /summary.txt`,
        output: <p>{basics?.summary}</p>
    },
    {
        command: `git log --author="${basics?.name?.split(' ').join('-')}" --since="10.years"`,
        output: (
            <>
                <Divider />
                <div className="output-work-list">
                    {(work ?? []).map((job: any) => (
                        <div key={job.name + job.startDate} className="output-work-item">
                            <p><span className="position">{job.position}</span> @ {job.name}</p>
                            <p className="date">{job.startDate} - {job.endDate}</p>
                            <ul className="highlights">
                                {(job.highlights ?? []).map((h:string) => <li key={h}>{h}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </>
        )
    },
    {
        command: `ls -R /skills`,
        output: (
            <>
                <Divider />
                <div className="output-skills">
                    {(skills ?? []).flatMap(s => s.keywords ?? []).map((keyword: string) => <span key={keyword}>{keyword}</span>)}
                </div>
            </>
        )
    },
    {
        command: `find /projects -type f -exec ls -l {} \;`,
        output: (
            <>
                <Divider />
                <div className="output-projects">
                    {(projects ?? []).map((p: any) => <p key={p.name}><span className="text-accent">{p.name}</span> - {p.description}</p>)}
                </div>
            </>
        )
    },
    {
        command: `cat /etc/education.db`,
        output: (
            <>
                <Divider />
                <div className="output-education">
                    {(education ?? []).map((e: any) => <p key={e.institution}><span className="font-bold">{e.institution}</span>: {e.studyType}, {e.area} (<span className="date">{e.endDate}</span>)</p>)}
                </div>
            </>
        )
    },
    {
        command: `locale -a`,
        output: (
            <>
                <Divider />
                <div className="output-languages">
                    {(languages ?? []).map((l: any) => <p key={l.language}>{l.language} ({l.fluency})</p>)}
                </div>
            </>
        )
    }
  ], [basics, work, skills, projects, education, languages]);

  return (
    <div id="resume-content" className="terminal-layout">
      <div className="terminal-container">
        {/* Screen version with animations */}
        <div className="screen-only">
          {commands.map((cmd, index) => {
              if (index < commandStep) {
                  return <StaticCommand key={index} command={cmd.command}>{cmd.output}</StaticCommand>;
              }
              if (index === commandStep) {
                  return <AnimatingCommand key={index} command={cmd.command} onFinished={handleNextCommand} />;
              }
              return null;
          })}
          {commandStep >= commands.length && <div className="command-prompt"><span className="prompt-symbol">$&gt;</span><BlinkingCursor /></div>}
        </div>

        {/* Print version - static and instant */}
        <div className="print-only">
          {commands.map((cmd, index) => (
            <StaticCommand key={index} command={cmd.command}>{cmd.output}</StaticCommand>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTerminal;