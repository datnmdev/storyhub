import { memo, useRef } from 'react';
import { CardProps, DragItem, ItemTypes } from './Card.type';
import { useDrag, useDrop } from 'react-dnd';
import { Image } from 'antd';

function Card({ item, index, moveItem, onDeleteClick }: CardProps) {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.CARD,
    hover(draggedItem, _monitor) {
      const fromIndex = draggedItem.originalIndex;
      const toIndex = index;

      if (fromIndex === toIndex) return;

      moveItem(fromIndex, toIndex);
      draggedItem.originalIndex = toIndex;
    },
  });

  const [{ isDragging: _ }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id: item.order, originalIndex: index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li ref={ref} className="relative ml-2 mt-2 group">
      <span className="group-hover:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] w-8 h-8 bg-[var(--primary)] text-white flex items-center justify-center rounded-full border-[2px] border-solid border-white">
        {item.order}
      </span>

      <span
        className="group-hover:flex absolute top-1 right-1 z-[1] w-8 h-8 cursor-pointer hover:bg-[var(--light-gray)] text-red-500 hidden items-center justify-center rounded-full"
        onClick={onDeleteClick}
      >
        <i className="fa-solid fa-trash-can"></i>
      </span>

      <Image
        width={100}
        height={100}
        src={item.previewUrl}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
          borderRadius: 4,
        }}
      />
    </li>
  );
}

export default memo(Card);
