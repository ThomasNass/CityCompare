export default function InputField({
  className = "search-input",
  value,
  name,
  type,
  onChange,
  placeholder,
}) {
  return (
    <input
      className={className}
      value={value}
      name={name}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
