export default function DataList({ className, name, type, onChange, placeholder, array }) {
  return (
    <>
      <input
        className={className}
        name={name}
        type={type}
        list={`${name}-data`}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <datalist id={`${name}-data`}>
        {array.map((element) => (
          <option key={element} value={element} />
        ))}
      </datalist>
    </>
  );
}
