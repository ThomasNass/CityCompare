export default function BusinessRows({ cities }) {
  return (
    <>
      {cities.map((comparison) => (
        <tr key={comparison.buisness}>
          <td>{comparison.buisness}</td>
          <td className={comparison.city1 === "ja" ? "green" : "red"}>{comparison.city1}</td>
          <td className={comparison.city2 === "ja" ? "green" : "red"}>{comparison.city2}</td>
        </tr>
      ))}
    </>
  );
}
