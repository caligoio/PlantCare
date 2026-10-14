import CollectionCard from "./CollectionCard";
import {
  daysUntilWatering,
  formatDate,
  getNextWateringDate,
  isDueToday,
  sortByUrgency,
} from "./wateringUtils";

const UPCOMING_DAYS = 7; // jadwal yang ditampilkan: 7 hari ke depan

// Props:
//  items     -> item koleksi yang sudah digabung dengan data tanaman (plant)
//  onWatered -> (id) => void
//  onRemove  -> (id) => void
export default function WateringSchedule({ items, onWatered, onRemove }) {
  const withPlant = items.filter((item) => item.plant);

  const dueToday = sortByUrgency(
    withPlant.filter((item) =>
      isDueToday(item.lastWatered, item.plant.wateringIntervalDays)
    )
  );

  const upcoming = sortByUrgency(
    withPlant.filter((item) => {
      const left = daysUntilWatering(
        item.lastWatered,
        item.plant.wateringIntervalDays
      );
      return left > 0 && left <= UPCOMING_DAYS;
    })
  );

  return (
    <div className="schedule">
      <section className="collection__section">
        <h3 className="collection__heading">
          Perlu disiram hari ini
          <span className="badge">{dueToday.length}</span>
        </h3>
        {dueToday.length > 0 ? (
          <div className="collection__grid">
            {dueToday.map((item) => (
              <CollectionCard
                key={item.id}
                item={item}
                onWatered={onWatered}
                onRemove={onRemove}
              />
            ))}
          </div>
        ) : (
          <p className="collection__note">
            <span aria-hidden="true">✅</span> Semua tanaman sudah tercukupi
            airnya hari ini.
          </p>
        )}
      </section>

      <section className="collection__section">
        <h3 className="collection__heading">
          Jadwal {UPCOMING_DAYS} hari ke depan
          <span className="badge">{upcoming.length}</span>
        </h3>
        {upcoming.length > 0 ? (
          <ul className="schedule__list">
            {upcoming.map((item) => {
              const { plant, lastWatered, nickname } = item;
              const left = daysUntilWatering(
                lastWatered,
                plant.wateringIntervalDays
              );
              const nextDate = getNextWateringDate(
                lastWatered,
                plant.wateringIntervalDays
              );
              return (
                <li key={item.id} className="schedule__item">
                  <span className="schedule__emoji" aria-hidden="true">
                    {plant.emoji}
                  </span>
                  <span className="schedule__info">
                    <span className="schedule__name">
                      {nickname || plant.name}
                    </span>
                    <span className="schedule__when">
                      {formatDate(nextDate, true)}
                    </span>
                  </span>
                  <span className="pill pill--ok">{left} hari lagi</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="collection__note">
            Belum ada jadwal penyiraman dalam {UPCOMING_DAYS} hari ke depan.
          </p>
        )}
      </section>
    </div>
  );
}
