import { useState } from "react";
import SearchBar from "../../../components/common/SearchBar";
import { Track } from "../types/Track";
import { getSpotifyAccessToken } from "../../../apis/spotify/getSpotifyAccessToken";
import { searchTrack } from "../../../apis/spotify/spotifySearch";
import InputField from "../../../components/common/InputField";
import SelectBox from "../../../components/common/SelectBox";
import { BopTrack } from "../types/BopTrack";
import { X } from "lucide-react";

interface BopPostFormProps {
  bopTrack: BopTrack | null;
  bopGenre: string;
  bopText: string;
  setBopTrack: (track: BopTrack | null) => void;
  setBopText: (value: string) => void;
  setBopGenre: (value: string) => void;
}

export default function BopPostForm({
  bopTrack,
  bopText,
  bopGenre,
  setBopTrack,
  setBopText,
  setBopGenre,
}: BopPostFormProps) {
  const genreOptions = [
    { value: "Country", label: "Country" },
    { value: "Hip-hop", label: "Hip-hop" },
    { value: "POP", label: "POP" },
    { value: "Rock", label: "Rock" },
    { value: "EDM", label: "EDM" },
    { value: "Jazz", label: "Jazz" },
    { value: "R&B", label: "R&B" },
    { value: "Indie", label: "Indie" },
    { value: "alternative", label: "alternative" },
  ];

  const [trackInput, setTrackInput] = useState("");
  const [tracks, setTracks] = useState([]);

  const searchHandler = async (e: React.FormEvent) => {
    if (trackInput.length === 0) {
      setTracks([]);
      return;
    }

    e.preventDefault();

    const accessToken = await getSpotifyAccessToken();
    const results = await searchTrack(trackInput, accessToken);
    setTracks(results);
  };

  return (
    <>
      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <label htmlFor="trackInput">나의 숨듣명 *</label>
          <SearchBar
            value={trackInput}
            onChange={(e) => {
              setTrackInput(e.target.value);
              searchHandler(e);
            }}
          />
          <div className="relative w-full">
            {bopTrack && (
              <div className="flex px-4 items-center w-full justify-between border rounded-[10px] py-2 border-[color:var(--primary-300)]">
                <div className="flex gap-4 items-center">
                  <img className="h-10 w-10" src={bopTrack.image} />
                  {bopTrack.name} -{" "}
                  {Array.isArray(bopTrack.artists)
                    ? bopTrack.artists.join(", ")
                    : bopTrack.artists}
                </div>
                <X
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setBopTrack(null)}
                />
              </div>
            )}
            {trackInput && (
              <ul className="absolute top-0 left-0 right-0 mt-1 border rounded-[10px] bg-[color:var(--bg-color)] shadow z-10 max-h-60 overflow-y-auto border-[color:var(--primary-200)] text-[color:var(--white-80)]">
                {tracks.map((track: Track) => (
                  <li
                    key={track.id}
                    onClick={() => {
                      setBopTrack({
                        id: track.id,
                        name: track.name,
                        artists: track.artists.map((artist) => artist.name),
                        image: track.album.images[0]?.url ?? "",
                      });
                      setTracks([]);
                      setTrackInput("");
                    }}
                    className="px-5 py-2 hover:bg-[color:var(--grey-600)] hover:text-[color:var(--white)] cursor-pointer"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        className="h-10 w-10"
                        src={track.album.images[0]?.url ?? ""}
                      />
                      {track.name} - {track.artists[0].name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="trackGenre">숨듣명 장르 *</label>
          <SelectBox
            options={genreOptions}
            value={genreOptions.find((opt) => opt.value === bopGenre) || null}
            onChange={(selected) => setBopGenre(selected.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            className="py-4"
            label="숨듣명 선정 이유 *"
            type="text"
            //maxLength="40"
            id="bopText"
            name="bopText"
            autoComplete="bopText"
            placeholder="40자 내외로 작성해주세요."
            value={bopText}
            onChange={(e) => {
              setBopText(e.target.value);
            }}
          />
        </div>
      </form>
    </>
  );
}
