import React, { useEffect, useRef, useState } from "react";

const avatarUrls = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww",
  "https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740",
  "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYq5Q5vtPMetbB77I30rhC80N8CVw37d8CFg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZAnvcyMxoOnmcm54BwRhXXIyP42TlHRk69g&s",
];

const testimonials = [
  {
    name: "Ratna Kumar Sahoo",
    text: "You do not have to cook fancy or complicated masterpieces. Just good food from fresh ingredients... Cheers to Nutriblend!",
    avatar: avatarUrls[0],
    rating: 5,
  },
  {
    name: "Pravat Biswal",
    text: "Have been eating unhealthy and fried food for a couple of days. One meal from Nutriblend and I feel so much better already.",
    avatar: avatarUrls[1],
    rating: 5,
  },
  {
    name: "Ashish Behera",
    text: "Amazing food offered at this place. Subscription plans also available. Tell them your diet plan, they will supply it month on month.",
    avatar: avatarUrls[2],
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    text: "Healthy, tasty and timely!  made staying on track with my diet so convenient. Highly recommended.",
    avatar: avatarUrls[3],
    rating: 5,
  },
  {
    name: "Priya Reddy",
    text: "The variety in the menu is great. I never feel bored eating from Nutriblend. Every delivery is fresh and delicious.",
    avatar: avatarUrls[4],
    rating: 5,
  },
  {
    name: "Saurav Jena",
    text: "Great support team, flexible plans, and fantastic taste. I have noticed a real difference in my energy levels!",
    avatar: avatarUrls[5],
    rating: 5,
  },
];

export default function Testimonials() {
  const [startIdx, setStartIdx] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(window.innerWidth < 768 ? 1 : 3);
  const [cardAnim, setCardAnim] = useState(Array(testimonials.length).fill(false));
  const [imgAnim, setImgAnim] = useState(Array(testimonials.length).fill(false));
  const timer = useRef();

  // Responsive card count logic
  useEffect(() => {
    const updateCardCount = () => {
      setCardsVisible(window.innerWidth < 768 ? 1 : 3);
    };
    updateCardCount();
    window.addEventListener("resize", updateCardCount);

    timer.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      clearInterval(timer.current);
      window.removeEventListener("resize", updateCardCount);
    };
  }, []);

  const resetInterval = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const handlePrev = () => {
    setStartIdx((prev) =>
      prev === 0 ? testimonials.length - cardsVisible : prev - 1
    );
    resetInterval();
  };

  const handleNext = () => {
    setStartIdx((prev) =>
      prev + cardsVisible >= testimonials.length ? 0 : prev + 1
    );
    resetInterval();
  };

  const getVisibleIndices = () => {
    let arr = [];
    for (let i = 0; i < cardsVisible; i++) {
      arr.push((startIdx + i) % testimonials.length);
    }
    return arr;
  };

  const handleCardClick = (idx) => {
    setCardAnim((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    setTimeout(() => {
      setCardAnim((prev) => {
        const next = [...prev];
        next[idx] = false;
        return next;
      });
    }, 400);
  };

  const handleImageClick = (idx) => {
    setImgAnim((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    setTimeout(() => {
      setImgAnim((prev) => {
        const next = [...prev];
        next[idx] = false;
        return next;
      });
    }, 700);
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="w-full py-10 bg-white">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">TESTIMONIALS</h2>
        <div className="w-40 border-t-2 border-green-300 rounded mx-auto mb-8"></div>
      </div>

      <div className="relative flex justify-center items-center">
        <button
          aria-label="Previous"
          onClick={handlePrev}
          className="absolute left-0 h-full flex items-center px-1 sm:px-2 z-10 rounded transition hover:bg-green-50"
        >
          <span className="w-9 h-9 flex items-center justify-center bg-white border rounded-full shadow text-green-600 hover:bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        <div
          className={`flex ${
            cardsVisible === 1 ? "justify-center" : "space-x-5 md:space-x-8"
          } transition-all duration-500 ease-in-out`}
        >
          {visibleIndices.map((idxOnFullList) => (
            <div
              key={idxOnFullList}
              className={`bg-white border border-green-200 rounded-2xl flex flex-col items-center px-5 py-8 w-[330px] md:w-[340px] transition-shadow hover:shadow-lg cursor-pointer ${
                cardAnim[idxOnFullList]
                  ? "animate-bounce scale-105 shadow-2xl border-green-400"
                  : ""
              }`}
              onClick={() => handleCardClick(idxOnFullList)}
              style={{ transition: "box-shadow 0.3s, border-color 0.3s, transform 0.22s" }}
            >
              <div
                className={`flex justify-center -mt-14 mb-3 transition-transform duration-500 ${
                  imgAnim[idxOnFullList]
                    ? "animate-spin-slow scale-125 ring-green-400"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(idxOnFullList);
                }}
                style={{ cursor: "pointer", transition: "transform 0.4s" }}
              >
                <img
                  src={testimonials[idxOnFullList].avatar}
                  alt={testimonials[idxOnFullList].name}
                  className={`w-20 h-20 rounded-full ring-4 object-cover bg-gray-50 ${
                    imgAnim[idxOnFullList] ? "ring-green-400" : "ring-green-100"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-lg md:text-xl text-center mb-2">
                {testimonials[idxOnFullList].name}
              </h3>
              <div className="flex flex-col items-center">
                <div className="flex mb-2">
                  {[...Array(testimonials[idxOnFullList].rating)].map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.539 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.38-2.455c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  {[...Array(5 - testimonials[idxOnFullList].rating)].map((_, starIdx) => (
                    <svg
                      key={starIdx + testimonials[idxOnFullList].rating}
                      className="w-6 h-6 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.539 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.38-2.455c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-center text-base md:text-[17px]">
                  {testimonials[idxOnFullList].text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Next"
          onClick={handleNext}
          className="absolute right-0 h-full flex items-center px-1 sm:px-2 z-10 rounded transition hover:bg-green-50"
        >
          <span className="w-9 h-9 flex items-center justify-center bg-white border rounded-full shadow text-green-600 hover:bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}
