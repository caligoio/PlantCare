import { daysUntilWatering } from "./useCollection";

// Komponen presentasi: hanya menampilkan data & memanggil callback dari props.
// Props:
//  item        -> { id, plantId, nickname, lastWatered, plant }
//  onWatered   -> (id) => void
//  onRemove    -> (id) => void
export default function CollectionCard({ item, onWatered, onRemove }) {
  const { id, nickname, lastWatered, plant } = item;
  const plantName = plant?.name ?? "Tanaman tidak ditemukan";
  const title = nickname || plantName;
  const daysLeft = plant
    ? daysUntilWatering(lastWatered, plant.wateringIntervalDays)
    : null;

  let statusText = "";
  let statusClass = "collection-card__status";
  if (daysLeft !== null) {
    if (daysLeft < 0) {
      statusText = `Terlambat ${Math.abs(daysLeft)} hari`;
      statusClass += " collection-card__status--due";
    } else if (daysLeft === 0) {
      statusText = "Siram hari ini";
      statusClass += " collection-card__status--due";
    } else {
      statusText = `Siram lagi ${daysLeft} hari lagi`;
    }
  }

  const formattedDate = new Date(`${lastWatered}T00:00:00`).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="collection-card">
      {plant?.image && (
        <img className="collection-card__image" src={plant.image} alt={plantName} />
      )}

      <div className="collection-card__body">
        <h3 className="collection-card__title">{title}</h3>
        {nickname && <p className="collection-card__species">{plantName}</p>}
        <p className="collection-card__date">Terakhir disiram: {formattedDate}</p>
        {statusText && <p className={statusClass}>{statusText}</p>}
      </div>

      <div className="collection-card__actions">
        <button type="button" onClick={() => onWatered(id)}>
          Sudah disiram
        </button>
        <button
          type="button"
          className="collection-card__remove"
          onClick={() => onRemove(id)}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}
