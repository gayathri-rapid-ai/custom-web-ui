export const Input: React.FC<{
  value?: string;
  type?: string;
  placeholder?: string;
}> = ({ value, type = 'text', placeholder }) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
  />
);