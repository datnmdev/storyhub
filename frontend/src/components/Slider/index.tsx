import { Children, isValidElement, memo, useEffect, useRef } from 'react';
import { SliderProps } from './Slider.type';
import scrollIntoView from 'scroll-into-view-if-needed';
import slidePaginationStyles from './Slider.module.scss';
import classNames from 'classnames';
import IconButton from '@components/IconButton';

function Slider({ slideTransitionDelay = 4000, children }: SliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const slidePaginationRefs = useRef<HTMLDivElement[]>([]);
  const previousSlidePositionRef = useRef<number>(0);
  const currentSlidePositionRef = useRef<number>(0);
  const nextSlidePositionRef = useRef<number>(0);
  const intervalIdRef = useRef<number | undefined>(undefined);

  function getSlideWidth() {
    if (window.innerWidth < 740) {
      return '100%';
    } else if (window.innerWidth >= 740 && window.innerWidth < 1024) {
      return 'calc(100% / 2)';
    } else {
      return 'calc(100% / 3)';
    }
  }

  const childrenArray = Children.toArray(children);
  const isValidChildrenArray = childrenArray.every((child) => {
    return isValidElement(child);
  });

  const addToSlideRefs = (el: HTMLDivElement | null) => {
    if (el && !slideRefs.current.includes(el)) {
      slideRefs.current.push(el);
    }
  };

  const addToSlidePaginationRefs = (el: HTMLDivElement | null) => {
    if (el && !slidePaginationRefs.current.includes(el)) {
      slidePaginationRefs.current.push(el);
    }
  };

  function scrollInToView(position: number) {
    clearInterval(intervalIdRef.current);

    // Scroll đến vị trí đã chỉ định ngay lập tức
    slidePaginationRefs.current[
      currentSlidePositionRef.current - 1 < 0
        ? slideRefs.current.length - 1
        : currentSlidePositionRef.current - 1
    ].classList.remove(slidePaginationStyles.slideActivated);
    slidePaginationRefs.current[position].classList.add(
      slidePaginationStyles.slideActivated
    );
    scrollIntoView(slideRefs.current[position], {
      scrollMode: 'always',
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
      boundary: containerRef.current,
    });
    previousSlidePositionRef.current =
      position - 1 < 0 ? slideRefs.current.length - 1 : position - 1;
    position = (position + 1) % slideRefs.current.length;
    nextSlidePositionRef.current = position;
    currentSlidePositionRef.current = position;

    // Tự động chuyển slide
    intervalIdRef.current = setInterval(() => {
      slidePaginationRefs.current[
        position - 1 < 0 ? slideRefs.current.length - 1 : position - 1
      ].classList.remove(slidePaginationStyles.slideActivated);
      slidePaginationRefs.current[position].classList.add(
        slidePaginationStyles.slideActivated
      );
      scrollIntoView(slideRefs.current[position], {
        scrollMode: 'always',
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
        boundary: containerRef.current,
      });
      previousSlidePositionRef.current =
        position - 1 < 0 ? slideRefs.current.length - 1 : position - 1;
      position = (position + 1) % slideRefs.current.length;
      nextSlidePositionRef.current = position;
      currentSlidePositionRef.current = position;
    }, slideTransitionDelay);
  }

  useEffect(() => {
    if (slideRefs.current.length > 0) {
      scrollInToView(0);
    }
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [slideRefs]);

  useEffect(() => {
    function handleResize() {
      slideRefs.current.map((slide) => {
        slide.style.width = getSlideWidth();
      });
    }
    window.addEventListener('resize', handleResize);
    return () => {
      removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isValidChildrenArray) {
    return null;
  }

  return (
    <div>
      <div className="relative h-full">
        <div ref={containerRef} className="flex items-stretch overflow-hidden">
          {childrenArray.map((child, index) => {
            return (
              <div
                key={index}
                ref={addToSlideRefs}
                className="shrink-0"
                style={{
                  width: getSlideWidth(),
                }}
              >
                {child}
              </div>
            );
          })}
        </div>

        <IconButton
          icon={
            <i className="fa-solid fa-angle-left text-[2.2rem] text-[var(--white)] font-bold"></i>
          }
          bgColor="var(--primary)"
          padding="16px 12px"
          borderRadius="4px"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            opacity: 0.6,
            zIndex: 1,
          }}
          onClick={() => scrollInToView(previousSlidePositionRef.current)}
        />

        <IconButton
          icon={
            <i className="fa-solid fa-angle-right text-[2.2rem] text-[var(--white)] font-bold"></i>
          }
          bgColor="var(--primary)"
          padding="16px 12px"
          borderRadius="4px"
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            opacity: 0.6,
            zIndex: 1,
          }}
          onClick={() => scrollInToView(nextSlidePositionRef.current)}
        />
      </div>

      <div className="mt-4 flex justify-center items-center space-x-4">
        {childrenArray.map((_child, index) => {
          return (
            <div
              ref={addToSlidePaginationRefs}
              key={index}
              className={classNames(
                'relative w-3 h-3 bg-[var(--gray)] rounded-full hover:bg-[var(--black)] cursor-pointer',
                index == 0 ? slidePaginationStyles.slideActivated : null
              )}
              onClick={() => scrollInToView(index)}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Slider);
