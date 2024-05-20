const Gutter = () => {
  const [position, setPosition] = useState(0);
  const dragStartRef = useRef(0);
  const draggingRef = useRef(false);

  const handleMouseDown = (event) => {
    event.stopPropagation();
    draggingRef.current = true;
    dragStartRef.current = event.clientY;
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  const handleMouseMove = (event) => {
    if (draggingRef.current) {
      const newPosition = position + event.clientY - dragStartRef.current;
      setPosition(newPosition);
      dragStartRef.current = event.clientY;
    }
  };

  useEffect(() => {
    const handleMouseUpWindow = () => handleMouseUp();
    const handleMouseMoveWindow = (event) => handleMouseMove(event);

    window.addEventListener('mouseup', handleMouseUpWindow);
    window.addEventListener('mousemove', handleMouseMoveWindow);

    return () => {
      window.removeEventListener('mouseup', handleMouseUpWindow);
      window.removeEventListener('mousemove', handleMouseMoveWindow);
    };
  }, [position]);

  return (
    <div style={{ position: 'relative', top: `${position}px`, cursor: 'row-resize', background: '#ccc', height: '10px', zIndex: 1 }} onMouseDown={handleMouseDown} />
  );
};  