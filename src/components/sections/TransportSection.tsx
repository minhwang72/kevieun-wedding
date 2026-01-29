'use client'

import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function TransportSection() {
    const { ref, animationClass } = useScrollAnimation({ threshold: 0.2, animationDelay: 200 })

    return (
        <section className="w-full py-12 md:py-16 px-6 md:px-12 font-sans theme-bg-section">
            <div
                ref={ref}
                className={`w-full max-w-sm mx-auto text-center transition-all duration-800 ${animationClass}`}
            >
                <SectionHeading
                    kicker="Transport"
                    title="전세버스 안내"
                />

                <div className="mt-8 space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            Location
                        </h3>
                        <p className="text-lg text-gray-800 leading-relaxed font-body">
                            춘천시 사우로 152<br />
                            우두명가 앞 대로변
                        </p>
                    </div>

                    <div className="w-8 h-px bg-gray-300 mx-auto"></div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            Departure Time
                        </h3>
                        <p className="text-lg text-gray-800 leading-relaxed font-body">
                            오전 9시 30분
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
