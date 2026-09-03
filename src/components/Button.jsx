export default function Button({ id, onClick, text }) {
  return (
    <button id={id} type="button" onClick={onClick}>
      {text}
    </button>
  );
}
