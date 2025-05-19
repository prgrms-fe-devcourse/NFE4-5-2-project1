import { logos } from "../../utils/getLogoImages";

export default function InfinityLogo() {
  return (
    <div className="marquee-wrapper my-15">
      <div className="marquee-track flex flex-row justify-between items-center">
        {logos.map((logo) => (
          <a
            href={logo.url}
            key={logo.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img key={logo.name} width={130} src={logo.logo} alt={logo.name} />
          </a>
        ))}
        {logos.map((logo) => (
          <a
            href={logo.url}
            key={logo.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img key={logo.name} width={130} src={logo.logo} alt={logo.name} />
          </a>
        ))}
      </div>
    </div>
  );
}
