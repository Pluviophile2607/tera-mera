import React from "react";
import { motion } from "framer-motion";
import { Check, Leaf, Menu, X } from "lucide-react";
const heroImage = "https://cdn.designfast.io/image/2026-04-24/e6dff0a2-0bcc-48d4-be45-e53b9882b0a1.png";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { apiUrl } from "./lib/api";
import { useAuth } from "./context/AuthContext";
const logoUrl = "https://cdn.designfast.io/image/2026-04-24/8e2b8b99-262e-4f37-976d-54efc96987a6.png";
import { AnimatePresence } from "framer-motion";

const Hero = ({ onBrowseClick }) => (
  <section className="relative bg-white pt-6 pb-8 md:pt-2 md:pb-12 lg:pt-4 lg:pb-16 overflow-hidden">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <div className="mb-6 inline-block bg-secondary px-3 py-1 font-display text-[10px] md:text-xs font-black uppercase tracking-widest">
            Community First
          </div>
          <h1 className="mb-8 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] uppercase tracking-tighter">
            Tera Mera
            <br />
            <span className="text-primary italic">Mera Tera!</span>
          </h1>
          <p className="mx-auto lg:mx-0 mb-6 max-w-lg text-lg sm:text-xl md:text-2xl font-bold leading-tight opacity-90">
            The neighborhood loop where giving is as rewarding as receiving.
            Share what you have, wish for what you need.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link to="/signup">
              <button className="w-full sm:w-auto border-4 border-outline bg-primary px-8 py-4 font-display text-lg md:text-xl font-black uppercase tracking-widest text-white shadow-brutalist hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutalist-lg transition-all">
                Start Sharing
              </button>
            </Link>
            <button 
              onClick={onBrowseClick}
              className="w-full sm:w-auto border-4 border-outline bg-white px-8 py-4 font-display text-lg md:text-xl font-black uppercase tracking-widest text-on-surface shadow-brutalist hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutalist-lg transition-all"
            >
              Browse Neighborhood
            </button>
          </div>
        </motion.div>

        <div className="relative max-w-xl mx-auto lg:max-w-lg">
          <div className="relative z-10 border-[6px] md:border-[10px] border-secondary bg-white p-2 shadow-brutalist-lg">
            <img
              src={heroImage}
              alt="Neighbors sharing"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-20 -rotate-3 border-4 border-outline bg-accent-orange px-4 py-2 md:px-6 md:py-4 font-display text-sm md:text-xl font-black uppercase text-white shadow-brutalist">
            240 Circular Items This Week
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="bg-[#F2F2F2] pt-8 pb-6 md:pt-16 md:pb-12">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <motion.div
          whileHover={{ y: -4 }}
          className="border-4 border-outline bg-white p-6 md:p-10 shadow-brutalist transition-shadow"
        >
          <div className="mb-8 flex h-16 w-16 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-12 w-12 text-primary"
            >
              <path d="M9.3349 11.5022L11.5049 11.5027C13.9902 11.5027 16.0049 13.5174 16.0049 16.0027L9.00388 16.0018L9.00488 17.0027L17.0049 17.0019V16.0027C17.0049 14.9202 16.6867 13.8996 16.1188 13.0019L19.0049 13.0027C20.9972 13.0027 22.7173 14.1679 23.521 15.8541C21.1562 18.9747 17.3268 21.0027 13.0049 21.0027C10.2436 21.0027 7.90437 20.4121 6.00447 19.3779L6.00592 10.0737C7.25147 10.2521 8.39122 10.7583 9.3349 11.5022ZM4.00488 9.00268C4.51772 9.00268 4.94039 9.38872 4.99816 9.88606L5.00488 10.0018V19.0027C5.00488 19.555 4.55717 20.0027 4.00488 20.0027H2.00488C1.4526 20.0027 1.00488 19.555 1.00488 19.0027V10.0027C1.00488 9.45039 1.4526 9.00268 2.00488 9.00268H4.00488ZM13.6513 3.57806L14.0046 3.93183L14.3584 3.57806C15.3347 2.60175 16.9177 2.60175 17.894 3.57806C18.8703 4.55437 18.8703 6.13728 17.894 7.11359L14.0049 11.0027L10.1158 7.11359C9.13948 6.13728 9.13948 4.55437 10.1158 3.57806C11.0921 2.60175 12.675 2.60175 13.6513 3.57806Z"></path>
            </svg>
          </div>
          <h3 className="mb-4 font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
            Tera (The Giver)
          </h3>
          <p className="mb-8 text-lg md:text-xl font-bold opacity-70 leading-snug">
            You have items that deserve a second life. A bike your child
            outgrew, a vintage mixer, or extra garden harvest. In TeraMera,
            givers are the heartbeat of the ecosystem.
          </p>
          <ul className="space-y-4">
            {[
              "Declutter with purpose",
              "Build neighborhood karma",
              "Track your planetary impact",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 font-bold text-sm md:text-base"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-4 w-4 stroke-[4]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="border-4 border-outline bg-secondary p-6 md:p-10 shadow-brutalist transition-shadow"
        >
          <div className="mb-8 flex h-16 w-16 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-12 w-12 text-[#5b4b00]"
            >
              <path d="M15.0049 2.00281C17.214 2.00281 19.0049 3.79367 19.0049 6.00281C19.0049 6.73184 18.8098 7.41532 18.4691 8.00392L23.0049 8.00281V10.0028H21.0049V20.0028C21.0049 20.5551 20.5572 21.0028 20.0049 21.0028H4.00488C3.4526 21.0028 3.00488 20.5551 3.00488 20.0028V10.0028H1.00488V8.00281L5.54065 8.00392C5.19992 7.41532 5.00488 6.73184 5.00488 6.00281C5.00488 3.79367 6.79574 2.00281 9.00488 2.00281C10.2001 2.00281 11.2729 2.52702 12.0058 3.35807C12.7369 2.52702 13.8097 2.00281 15.0049 2.00281ZM11.0049 10.0028H5.00488V19.0028H11.0049V10.0028ZM19.0049 10.0028H13.0049V19.0028H19.0049V10.0028ZM9.00488 4.00281C7.90031 4.00281 7.00488 4.89824 7.00488 6.00281C7.00488 7.05717 7.82076 7.92097 8.85562 7.99732L9.00488 8.00281H11.0049V6.00281C11.0049 5.00116 10.2686 4.1715 9.30766 4.02558L9.15415 4.00829L9.00488 4.00281ZM15.0049 4.00281C13.9505 4.00281 13.0867 4.81869 13.0104 5.85355L13.0049 6.00281V8.00281H15.0049C16.0592 8.00281 16.923 7.18693 16.9994 6.15207L17.0049 6.00281C17.0049 4.89824 16.1095 4.00281 15.0049 4.00281Z"></path>
            </svg>
          </div>
          <h3 className="mb-4 font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
            Mera (The Receiver)
          </h3>
          <p className="mb-8 text-lg md:text-xl font-bold opacity-70 leading-snug">
            You have a need, a wish, or a curiosity. Why buy new when your
            neighbor has exactly what you're looking for? Receivers keep the
            loop moving.
          </p>
          <ul className="space-y-4">
            {[
              "Find local treasures for free",
              "Connect with like-minded locals",
              "Reduce waste in your city",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 font-bold text-sm md:text-base"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-black">
                  <Check className="h-4 w-4 stroke-[4]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const LoopSection = () => (
  <section className="bg-white pt-6 pb-6 md:pt-12 md:pb-12">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 md:mb-16">
        <h2 className="mb-4 font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
          The Loop of Sharing
        </h2>
        <div className="h-2 w-24 bg-primary"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            num: "01",
            title: "Snap & Share",
            desc: "Take a photo of your unused treasure. Describe its story and let it for your neighbors to see.",
          },
          {
            num: "02",
            title: "Make a Wish",
            desc: "Need something? Post a 'Wish.' Neighbors can respond with items they're ready to pass on.",
          },
          {
            num: "03",
            title: "Loop Complete",
            desc: "Meet up locally, exchange the item, and share a moment. The item finds a new home, and trust grows.",
          },
        ].map((step, i) => (
          <div
            key={i}
            className="border-4 border-outline bg-surface p-8 md:p-10 shadow-brutalist transition-transform hover:-translate-y-1"
          >
            <span className="mb-8 block font-display text-5xl md:text-7xl font-black text-outline/10">
              {step.num}
            </span>
            <h4 className="mb-4 font-display text-xl md:text-2xl font-black uppercase tracking-tight">
              {step.title}
            </h4>
            <p className="text-base md:text-lg font-bold opacity-60 leading-tight">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Treasures = ({ items }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#F2F2F2] pt-6 pb-6 md:pt-12 md:pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="mb-2 font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Nearby Treasures
            </h2>
            <p className="font-display font-black uppercase tracking-widest text-primary/60 text-xs md:text-sm">
              Available right now in your zip code
            </p>
          </div>
          <Link to="/mera" className="w-full md:w-auto">
            <button className="w-full border-2 border-outline bg-white px-6 py-2 font-display text-xs md:text-sm font-black uppercase tracking-widest shadow-brutalist-sm hover:shadow-brutalist">
              View All Items
            </button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div
                key={item._id || i}
                className="border-4 border-outline bg-white shadow-brutalist transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden border-b-4 border-outline">
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"}
                    alt={item.title}
                    className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all"
                  />
                  <div className="absolute top-4 left-4 bg-accent-orange px-2 py-0.5 font-display text-[10px] font-black uppercase text-white outline outline-2 outline-outline">
                    {item.category}
                  </div>
                </div>
                <div className="p-5">
                  <h5 className="mb-1 font-display text-lg md:text-xl font-black uppercase leading-tight truncate">
                    {item.title}
                  </h5>
                  <p className="mb-6 text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-40">
                    {item.location} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => navigate('/login?redirect=mera')}
                    className="w-full border-4 border-outline bg-secondary py-3 font-display text-xs md:text-sm font-black uppercase tracking-widest shadow-brutalist-sm hover:shadow-brutalist"
                  >
                    Claim Item
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-4 border-dashed border-outline/20">
              <p className="font-display font-black uppercase tracking-widest opacity-40">Scanning for treasures...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => (
  <section className="bg-dark py-16 md:py-32 text-white overflow-hidden">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-16 md:gap-20 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h2 className="mb-8 font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-secondary">
            Trust is Local. Trust is You.
          </h2>
          <p className="mx-auto lg:mx-0 mb-12 md:mb-16 max-w-md text-lg md:text-xl font-bold opacity-60 leading-relaxed">
            We aren't a marketplace; we're a community. Every user has a Karma
            Score based on successful loops and verified local handoffs. No
            shipping, no bots, just neighbors.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-10 md:gap-16">
            <div>
              <div className="font-display text-5xl md:text-6xl font-black">
                98%
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-40">
                Successful Handoffs
              </div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl font-black">
                15k+
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-40">
                Neighbors Joined
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto lg:max-w-none">
          <div className="border-4 border-white/20 bg-white/5 p-6 md:p-8 backdrop-blur-sm card1 lg:translate-x-6">
            <div className="mb-6 border-l-4 md:border-l-8 border-accent-orange pl-4 md:pl-6 font-display text-base md:text-lg font-bold leading-snug italic opacity-80">
              "Met Sarah three blocks away to pick up some baking tins. We ended
              up sharing recipes for an hour. This is what community feels
              like."
            </div>
            <div className="font-display text-xs md:text-sm font-black uppercase tracking-widest text-[#FF8E53]">
              — Shaharsh, Vasant Vihar
            </div>
          </div>

          <div className="border-4 border-white/20 bg-white/5 p-6 md:p-8 backdrop-blur-sm card2 lg:-translate-x-5">
            <div className="mb-6 border-l-4 md:border-l-8 border-primary pl-4 md:pl-6 font-display text-base md:text-lg font-bold leading-snug italic opacity-80">
              "Gave away my old acoustic guitar to a teenager starting lessons.
              Seeing the joy was better than any ₹5000 I could have made on a
              resale app."
            </div>
            <div className="font-display text-xs md:text-sm font-black uppercase tracking-widest text-primary">
              — Neelam, Palava
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FAQItem = ({ question, answer, onOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && onOpen) {
      onOpen();
    }
  };

  return (
    <div className="border-4 border-outline bg-white shadow-brutalist transition-all hover:shadow-brutalist-lg">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
      >
        <span className="font-display text-lg md:text-xl font-black uppercase tracking-tight">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="flex-shrink-0 ml-4"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
            />
            <path
              d="M4 12H20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
            />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 md:px-8 md:pb-8 border-t-4 border-outline bg-surface/30">
          <p className="text-base md:text-lg font-bold opacity-70 mt-4">
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FAQ = () => {
  const [openedIndices, setOpenedIndices] = React.useState(new Set());
  
  const questions = [
    {
      question: "What is a circular economy?",
      answer:
        "A circular model is a system where we keep products and materials in use for as long as possible. Instead of the traditional 'take-make-waste' model, we focus on sharing, reusing, and repurposing to minimize environmental impact.",
    },
    {
      question: "Who are Teras and Meras?",
      answer:
        "Teras (Givers) are neighborhood heroes sharing items they no longer need. Meras (Receivers) are community members who give those items a second life. It's about closing the loop of sharing locally.",
    },
    {
      question: "How does the 5% fee work?",
      answer:
        "For premium items that include a small transaction fee, we take a minimal 5% cut. This helps us keep the platform ad-free, run neighborhood verification programs, and maintain a secure community loop.",
    },
    {
      question: "What is a karma score?",
      answer:
        "Karma Score tracks your positive impact in the neighborhood. It's earned through successful sharing, reliable meetups, and quality contributions. High Karma unlocks trust badges and priority access to popular items.",
    },
    {
      question: "Is my identity safe?",
      answer:
        "Absolutely. We use local verification and moderated signups. Your exact address is never public—handoffs are coordinated through secure chats, and you control who sees your neighborhood profile.",
    },
  ];

  const handleOpen = (index) => {
    setOpenedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const progressPercentage = (openedIndices.size / questions.length) * 100;

  return (
    <section className="bg-white pt-6 pb-12 md:pt-12 md:pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 md:mb-16">
          <h2 className="mb-4 font-display text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">
            COMMON QUESTIONS
          </h2>
          <div className="h-2 w-full bg-primary/20 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="absolute left-0 top-0 h-full bg-primary"
              transition={{ duration: 0.5, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          {questions.map((item, i) => (
            <FAQItem 
              key={i} 
              question={item.question} 
              answer={item.answer} 
              onOpen={() => handleOpen(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="relative bg-[#76efef] py-16 md:py-32 text-center overflow-hidden">
    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.05] md:opacity-[0.08] rotate-[12deg] pointer-events-none">
      <Leaf className="h-[250px] w-[250px] md:h-[400px] md:w-[400px] text-dark shadow-brutalist" />
    </div>

    <div className="relative z-10 mx-auto max-w-4xl px-6">
      <h2 className="mb-8 font-display text-4xl sm:text-5xl md:text-[72px] lg:text-[90px] font-black uppercase tracking-tight leading-[0.85] text-dark">
        Ready to Close the
        <br /> Loop?
      </h2>
      <p className="mb-10 md:mb-14 font-display text-xs md:text-base font-black uppercase tracking-widest text-dark opacity-90">
        Your first neighbor is already waiting to meet you.
      </p>
      <div className="flex flex-col justify-center gap-6 sm:flex-row">
        <Link to="/signup">
          <button className="w-full sm:w-auto border-4 border-outline bg-dark px-10 py-4 font-display text-lg font-black uppercase tracking-widest text-white shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Join the Movement
          </button>
        </Link>
      </div>
    </div>
  </section>
);

export default function Home() {
  const [items, setItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(apiUrl("/listings"));
        if (response.ok) {
          const data = await response.json();
          setItems(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchItems();
  }, []);

  const handleBrowseClick = () => {
    if (isAuthenticated) {
      navigate("/mera");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen selection:bg-secondary relative">
      <Navbar />
      <Hero onBrowseClick={handleBrowseClick} />
      <Features />
      <LoopSection />
      <Treasures items={items} />
      {/* <TrustSection /> */}
      <FAQ />
      <CTA />
      <Footer />

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md border-4 border-outline bg-white p-8 shadow-brutalist-lg"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-on-surface hover:rotate-90 transition-transform"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="mb-6 h-16 w-auto flex items-center justify-start">
                <img src={logoUrl} alt="TeraMera" className="h-10 w-auto" />
              </div>

              <h3 className="mb-4 font-display text-3xl font-black uppercase tracking-tight">
                Wait a Moment!
              </h3>
              <p className="mb-8 font-display text-sm font-bold uppercase tracking-widest text-on-surface opacity-70 leading-relaxed">
                You need to be logged in to browse the neighborhood listings and connect with neighbors.
              </p>

              <div className="flex flex-col gap-4">
                <Link to="/login" className="w-full">
                  <button className="w-full border-4 border-outline bg-primary py-3 font-display text-sm font-black uppercase tracking-[0.2em] text-white shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Log In Now
                  </button>
                </Link>
                <Link to="/signup" className="w-full">
                  <button className="w-full border-4 border-outline bg-white py-3 font-display text-sm font-black uppercase tracking-[0.2em] text-on-surface shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Create Account
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
