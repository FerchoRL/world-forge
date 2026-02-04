import { useNavigate } from 'react-router-dom'
import '@/shared/styles/not-found.css'

export function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="nf-root">
            {/* Pixel grid background */}
            <div className="nf-grid" id='test'/>

            {/* Floating glitch pixels */}
            <div className="nf-glitch cyan" />
            <div className="nf-glitch pink" />
            <div className="nf-glitch yellow" />
            <div className="nf-glitch green" />

            {/* Header */}
            <header className="nf-header">
                <div className="nf-logo">
                    <div className="nf-logo-pixel" />
                    <span>WORLD-FORGE</span>
                </div>
            </header>

            {/* Main */}
            <main className="nf-main">
                {/* 404 */}
                <div className="nf-title">
                    <div className="nf-404">404</div>

                    <div className="nf-bars">
                        <div className="bar cyan" />
                        <div className="bar pink" />
                        <div className="bar yellow" />
                    </div>

                    <div className="nf-warning">
                        ⚠ WRONG UNIVERSE DETECTED
                    </div>
                </div>

                {/* Characters */}

                {/* Characters container */}
                <div className="flex justify-center items-end gap-16 md:gap-24 mb-8">
                    {/* Hu Tao - Pixel chibi character */}
                    <div className="relative">
                        <div className="pixel-character">
                            {/* Hat with talisman - taller and more distinctive */}
                            <div className="flex justify-center mb-1">
                                <div className="flex flex-col gap-0">
                                    {/* Top of hat */}
                                    <div className="flex justify-center">
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                    </div>
                                    {/* Hat middle with red emblem */}
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        <div className="w-4 h-4 bg-[#dc2626]" />
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                    </div>
                                    {/* Hat brim */}
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        <div className="w-4 h-4 bg-[#1a0a1f]" />
                                    </div>
                                </div>
                            </div>

                            {/* Head with twin tails */}
                            <div className="flex justify-center mt-1">
                                <div className="flex gap-0">
                                    {/* Left twin tail */}
                                    <div className="flex flex-col gap-0">
                                        <div className="w-4 h-4 bg-[#3d2817]" />
                                        <div className="w-4 h-4 bg-[#3d2817]" />
                                        <div className="w-4 h-4 bg-[#3d2817]" />
                                    </div>

                                    {/* Face */}
                                    <div className="flex flex-col gap-0">
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#3d2817]" />
                                            <div className="w-4 h-4 bg-[#3d2817]" />
                                            <div className="w-4 h-4 bg-[#3d2817]" />
                                        </div>
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#1a1a1a]" />
                                            <div className="w-4 h-4 bg-[#ffd4a3]" />
                                            <div className="w-4 h-4 bg-[#1a1a1a]" />
                                        </div>
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#ffd4a3]" />
                                            <div className="w-4 h-4 bg-[#ff69b4]" />
                                            <div className="w-4 h-4 bg-[#ffd4a3]" />
                                        </div>
                                    </div>

                                    {/* Right twin tail with red flower */}
                                    <div className="flex flex-col gap-0">
                                        <div className="w-4 h-4 bg-[#dc2626]" />
                                        <div className="w-4 h-4 bg-[#3d2817]" />
                                        <div className="w-4 h-4 bg-[#3d2817]" />
                                    </div>
                                </div>
                            </div>

                            {/* Body - dark with red accents, tilted playfully */}
                            <div className="flex justify-center">
                                <div className="flex flex-col gap-0">
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                    </div>
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#dc2626]" />
                                        <div className="w-4 h-4 bg-[#dc2626]" />
                                        <div className="w-4 h-4 bg-[#dc2626]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                    </div>
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#ffd4a3]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#2a1520]" />
                                        <div className="w-4 h-4 bg-[#ffd4a3]" />
                                    </div>
                                </div>
                            </div>

                            {/* Legs */}
                            <div className="flex justify-center">
                                <div className="flex flex-col gap-0">
                                    <div className="flex gap-1">
                                        <div className="flex flex-col">
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                            <div className="w-4 h-4 bg-[#1a0a1f]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name tag */}
                        <div className="mt-3 text-center">
                            <div className="inline-block bg-pink-500 border-2 border-pink-700 px-3 py-1">
                                <p className="text-xs font-bold text-white">HU TAO</p>
                            </div>
                            <p className="text-xs text-pink-300 mt-1">^_^ Looks fun!</p>
                        </div>
                    </div>

                    {/* Question mark between characters */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                        <div className="text-5xl animate-bounce">❓</div>
                    </div>

                    {/* Ellie - Pixel chibi character */}
                    <div className="relative">
                        <div className="pixel-character">
                            {/* Messy hair */}
                            <div className="flex justify-center mb-1">
                                <div className="flex flex-col gap-0">
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                    </div>
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-transparent" />
                                    </div>
                                </div>
                            </div>

                            {/* Head with freckles */}
                            <div className="flex justify-center">
                                <div className="flex flex-col gap-0">
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                    </div>
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#6b4423]" />
                                        <div className="w-4 h-4 bg-[#1a1a1a]" />
                                        <div className="w-4 h-4 bg-[#ffd4a3]" />
                                        <div className="w-4 h-4 bg-[#1a1a1a]" />
                                    </div>
                                    <div className="flex">
                                        <div className="w-4 h-4 bg-[#ffd4a3]" />
                                        <div className="w-4 h-4 bg-[#8B4513]" />
                                        <div className="w-4 h-4 bg-[#8B4513]" />
                                        <div className="w-4 h-4 bg-[#ffd4a3]" />
                                    </div>
                                </div>
                            </div>

                            {/* Body with backpack and chest strap */}
                            <div className="flex justify-center">
                                <div className="flex gap-0">
                                    {/* Left side with backpack visible */}
                                    <div className="flex flex-col gap-0">
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#8B4513]" />
                                            <div className="w-4 h-4 bg-[#9b4444]" />
                                            <div className="w-4 h-4 bg-[#3d5a46]" />
                                            <div className="w-4 h-4 bg-[#3d5a46]" />
                                            <div className="w-4 h-4 bg-[#8B4513]" />
                                        </div>
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#9b4444]" />
                                            <div className="w-4 h-4 bg-[#3d5a46]" />
                                            <div className="w-4 h-4 bg-[#3d5a46]" />
                                            <div className="w-4 h-4 bg-[#3d5a46]" />
                                            <div className="w-4 h-4 bg-[#9b4444]" />
                                        </div>
                                        <div className="flex">
                                            <div className="w-4 h-4 bg-[#ffd4a3]" />
                                            <div className="w-4 h-4 bg-[#5a4a3a]" />
                                            <div className="w-4 h-4 bg-[#5a4a3a]" />
                                            <div className="w-4 h-4 bg-[#5a4a3a]" />
                                            <div className="w-4 h-4 bg-[#ffd4a3]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legs - slightly tense posture */}
                            <div className="flex justify-center">
                                <div className="flex flex-col gap-0">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col">
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                            <div className="w-4 h-4 bg-[#2d4a5a]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name tag */}
                        <div className="mt-3 text-center">
                            <div className="inline-block bg-cyan-500 border-2 border-cyan-700 px-3 py-1">
                                <p className="text-xs font-bold text-white">ELLIE</p>
                            </div>
                            <p className="text-xs text-cyan-300 mt-1">...where am I?</p>
                        </div>
                    </div>
                </div>
                {/* Text */}
                <div className="nf-text">
                    <h1>This path doesn't exist in this world.</h1>
                    <p>Even the characters seem lost…</p>
                    <em>(They're definitely not from the same game)</em>
                </div>

                {/* Button */}
                <button
                    className="nf-button"
                    onClick={() => navigate('/')}
                >
                    GO BACK TO WORLD-FORGE
                </button>

                <div className="nf-tip">
                    💡 TIP: Check your URL or try the navigation above
                </div>
            </main >
        </div >
    )
}
