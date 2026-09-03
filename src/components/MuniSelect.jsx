export default function MuniSelect({ className, name, onChange, array }) {
  return (
    <select className={className} name={name} defaultValue="" onChange={onChange} required>
      <option value="" disabled>
        Välj stad
      </option>
      {array.map((element) => (
        <option key={element} value={element}>
          {element}
        </option>
      ))}
    </select>
  );
}
