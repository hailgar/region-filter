import { useLoaderData, useSearchParams } from "react-router-dom";

type Province = { id: number; name: string };
type Regency = { id: number; name: string; province_id: number };
type District = { id: number; name: string; regency_id: number };

type Data = {
  provinces: Province[];
  regencies: Regency[];
  district: District[];
};

export async function loader(): Promise<Data> {
  const res = await fetch("/data/regions.json");
  return res.json();
}

export default function FilterPage() {
  const data = useLoaderData() as Data;
  const [params, setParams] = useSearchParams();

  const provinceId = params.get("province");
  const regencyId = params.get("regency");
  const districtId = params.get("district");

  const regencies = data.regencies.filter(
    r => r.province_id === Number(provinceId)
  );

  const districts = data.district.filter(
    d => d.regency_id === Number(regencyId)
  );

  const province = data.provinces.find(p => p.id === Number(provinceId));
  const regency = data.regencies.find(r => r.id === Number(regencyId));
  const district = data.district.find(d => d.id === Number(districtId));

  function updateParam(key: string, value: string) {
    const newParams = new URLSearchParams(params);

    if (!value) newParams.delete(key);
    else newParams.set(key, value);

    if (key === "province") {
      newParams.delete("regency");
      newParams.delete("district");
    }

    if (key === "regency") {
      newParams.delete("district");
    }

    setParams(newParams);
  }

  function reset() {
    setParams({});
  }

  return (
    <div className="flex min-h-screen">

      <aside className="w-80 border-r p-6 space-y-6">

        <div>
          <label>Provinsi</label>
          <select
            name="province"
            value={provinceId || ""}
            onChange={e => updateParam("province", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Provinsi</option>
            {data.provinces.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Kota/Kabupaten</label>
          <select
            name="regency"
            value={regencyId || ""}
            onChange={e => updateParam("regency", e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!provinceId}
          >
            <option value="">Pilih Kota</option>
            {regencies.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Kecamatan</label>
          <select
            name="district"
            value={districtId || ""}
            onChange={e => updateParam("district", e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!regencyId}
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={reset}
          className="border rounded py-2 w-full"
        >
          RESET
        </button>

      </aside>

      <div className="flex-1 p-16">

        <div className="breadcrumb text-gray-500 mb-8">
          {["Indonesia", province?.name, regency?.name, district?.name]
            .filter(Boolean)
            .join(" > ")}
        </div>

        <main className="text-center space-y-16">

          {province && (
            <div>
              <p className="uppercase text-gray-400">Provinsi</p>
              <h1 className="text-5xl font-bold">{province.name}</h1>
            </div>
          )}

          {regency && (
            <div>
              <p className="uppercase text-gray-400">Kota / Kabupaten</p>
              <h2 className="text-4xl font-semibold">{regency.name}</h2>
            </div>
          )}

          {district && (
            <div>
              <p className="uppercase text-gray-400">Kecamatan</p>
              <h3 className="text-3xl font-semibold">{district.name}</h3>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}