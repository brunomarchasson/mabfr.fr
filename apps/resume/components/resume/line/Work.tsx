
import { JSONResume } from "@/types/resume";

// This component now only handles the visual layout of the timeline.
// The path is a simple, hardcoded line for debugging purposes.
export default function Work({ work }: { work: NonNullable<JSONResume['work']> }) {

    const pathD = "M 50 0 V 100"; // Simple vertical line for debugging

    return (
        <section className="cv-section relative flex flex-col items-center py-16 px-4 gap-8 bg-transparent z-20">
            <h2 className="text-4xl font-bold mb-12 z-10 relative px-4 py-2">Expériences Professionnelles</h2>
            
            <div className="relative w-full flex flex-col items-center gap-8 z-10 max-w-6xl mx-auto">
                {work.map((item, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                        <div key={index} className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                            <div className="w-5/12">
                                <div className={`w-full p-4 bg-white shadow-lg rounded-xl border-t-4 ${isLeft ? 'border-blue-500' : 'border-green-500'}`}>
                                    <h3 className="text-xl font-bold text-gray-800">{item.position}</h3>
                                    <p className="text-lg font-semibold text-gray-600">{item.name}</p>
                                    <p className="text-xs text-gray-400 my-2">{item.startDate} - {item.endDate}</p>
                                    <p className="text-base text-gray-700">{item.summary}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* The simplified path for this section */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0 }}>
                <path className="cv-path-segment" d={pathD} />
            </svg>
        </section>
    );
}
