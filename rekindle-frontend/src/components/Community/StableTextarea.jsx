import { memo, useRef, useEffect, useCallback } from 'react';

// Completely isolated input component with useRef
const StableTextarea = memo(({ value, onChange, loading, placeholder, rows = 3, className, maxLength = 500, id, name }) => {
  const textareaRef = useRef(null);
  
  // Maintain focus on re-renders
  useEffect(() => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  });

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={loading}
      maxLength={maxLength}
      rows={rows}
      className={className}
    />
  );
});

export default StableTextarea; 