// ─────────────────────────────────────────────────────────────────────────────
// GEWISPage — hidden page accessible via /?page=GEWIS
//
// HOW TO ADD PICTURES
// -------------------
// 1. Drop image files into  src/assets/gewis/
// 2. Import them at the top of this file:
//      import myPhoto from '@/assets/gewis/my-photo.jpg';
// 3. Pass the import to the `image` prop of the relevant <Step> component:
//      <Step ... image={myPhoto} imageAlt="Description of photo" />
//    The image will appear below the step text, full-width within the card.
//
// Each <Step> accepts an optional `image` + `imageAlt` prop — that's all you need.
// ─────────────────────────────────────────────────────────────────────────────

import Route_to_mf from '@/assets/gewis/Route_to_mf.png';
import Metaforum_outside from '@/assets/gewis/Metaforum-buiten.webp';
import GEWIS_Room from '@/assets/gewis/GEWIS_Room.webp';
import metaforumFloor0 from '@/assets/gewis/metaforumFloor0.jpg';
import metaForum3 from '@/assets/gewis/metaForum3.jpeg';

const monoFont = { fontFamily: '"JetBrains Mono", monospace' };
const serifFont = { fontFamily: '"Playfair Display", serif' };

interface StepProps {
  number: number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

function Step({ number, title, description, image, imageAlt }: StepProps) {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0d1117] overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-bold flex items-center justify-center">
            {number}
          </span>
          <div className="space-y-1">
            <p className="text-white font-semibold text-sm tracking-wide">{title}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Image slot — appears when an image is provided */}
      {image && (
        <div className="border-t border-white/10">
          <img
            src={image}
            alt={imageAlt ?? title}
            className="w-full object-cover max-h-100"
          />
        </div>
      )}

      {/* Placeholder shown when no image is provided yet — remove once real images are added */}
      {!image && (
        <div className="border-t border-white/5 bg-white/[0.02] flex items-center justify-center h-20 text-gray-700 text-xs tracking-widest">
          [ photo coming soon ]
        </div>
      )}
    </div>
  );
}

export function GEWISPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white py-16 px-4" style={monoFont}>
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10">
          <a href="/" className="text-gray-600 text-xs hover:text-cyan-400 transition-colors">
            ← verkade.org
          </a>

          <div className="mt-5 space-y-1">
            <p className="text-cyan-400/60 text-xs tracking-widest uppercase">Secret page</p>
            <h1 className="text-3xl font-bold text-white" style={serifFont}>
              Finding GEWIS
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              A step-by-step guide to locating study association GEWIS at TU/e.
            </p>
          </div>

          <div className="h-px bg-cyan-400/20 mt-6" />
        </div>

        {/* Intro */}
        <div className="mb-8 p-4 rounded-lg bg-cyan-400/5 border border-cyan-400/15">
          <p className="text-gray-300 text-sm leading-relaxed">
            GEWIS is the study association for Mathematics &amp; Computer Science students at
            Eindhoven University of Technology (TU/e). Follow the steps below to find it.
          </p>
        </div>

        {/* Steps */}
        {/* ─── ADD IMAGES BY PASSING  image={...}  TO EACH STEP ─────────────────
            Example:
              import entrance from '@/assets/gewis/entrance.jpg';
              <Step number={1} ... image={entrance} imageAlt="Main building entrance" />
        ─────────────────────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <Step
            number={1}
            title="From Eindhoven Centraal, to MetaForum"
            description="Start at Eindhoven Centraal station. Exit the station on the north side. It's about a 10-minute walk to MetaForum. "
            image={Route_to_mf}
            // imageAlt="TU/e campus entrance on De Rondom"
          />

          <Step
            number={2}
            title="Find MetaForum (MF)"
            description="Once on campus, navigate to the MetaForum building. It looks a bit like Piet Mondriaan was busy designing it. You'll see the building when you follow the route from step 1 right in front of you."            
            image={Metaforum_outside}
            // imageAlt="MetaForum building exterior"
          />

          <Step
            number={3}
            title="Enter MetaForum and go to floor 3"
            description="Walk into MetaForum through the main entrance. Take the stairs or elevator to the 3rd floor. You should be able both on the right side after entering. Look for the reception as seen in the picture. The stairs are there as well. The elevator is across the stairs. The elevators won't take you to floors higher or equal to three without a keycard with approval after 18:00, so if you have trouble with the elevator, take the stairs."
            image={metaforumFloor0} 
            // imageAlt="MetaForum entrance and elevator area"
          />

          <Step
            number={4}
            title="Walk towards the GEWIS room"
            description="When exiting the stairs/ elevator you should see a door stopping you on the third floor. If it is closed, call +31 40 247 2815 or call me. Otherwise go through the door, go left, go through the other door and take a right"
            image={metaForum3}
            // imageAlt="MetaForum entrance and elevator area"
          />

          <Step
            number={5}
            title="THE GEWIS ROOM"
            description="Congrats! You found the GEWIS room and all glory associated with it. The beautiful red walls, the bar, the discobal, now you can finally get that drink you were promised." 
            image={GEWIS_Room}
            // imageAlt="GEWIS room door on MF floor 4"
          />
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs">
            Questions?{' '}
            <a
              href="https://gewis.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              gewis.nl
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
