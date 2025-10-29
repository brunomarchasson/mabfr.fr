import { Resume } from "@/lib/resume";
import Image from "next/image";
import style from './sidebar.module.css'
import IconText from "./IconText";
import { IconLib } from "@/components/icons";
import { JSONResume } from "@/types/resume";

type LocationProps = {
  address?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  countryCode?: string;
};

const Location: React.FC<LocationProps> = async ({
  address,
  postalCode,
  city,
  region,
  countryCode,
}: LocationProps) => {
  const text = [address, postalCode, city, region, countryCode]
    .filter(Boolean)
    .join(", ");

  return <IconText icon={IconLib.envelope} text={text} />;
};

export const Contact: React.FC<Resume> = async ({
  resumeData,
  hasAccess
}: Resume) => {
  const { email, url, phone, location } = resumeData?.basics ?? {};
  return (
    <div className={"contact"}>
      {url && (
        <a
          className="hide-href-print touch-target"
          target="_blank"
          href={url}
          rel="noreferrer"
        >
          <IconText icon={IconLib.web} text={url} />
        </a>
      )}
      {email && (
        <a
          className="hide-href-print touch-target"
          href={hasAccess ? `mailto:${email}` : undefined}
        >
          <IconText icon={IconLib.email} text={email} />
        </a>
      )}
      {phone && (
        <a
          className="hide-href-print touch-target"
          href={hasAccess ? `tel:${phone.replace(/\s+/g, "")}` : undefined}
        >
          <IconText icon={IconLib.phone} text={phone} />
        </a>
      )}
      {location && <Location {...location}></Location>}
    </div>
  );
};

type ProfileType = NonNullable<
  NonNullable<JSONResume["basics"]>["profiles"]
>[number];
const Profile: React.FC<ProfileType> = ({ network, username, url }) => {
  if (!network) return null;
  const Icon = IconLib[network.toLowerCase() as keyof typeof IconLib];
  return (
    <a
      className="hide-href-print touch-target"
      target="_blank"
      href={url}
      rel="noreferrer"
    >
      <IconText icon={Icon} text={username ?? ""} />
    </a>
  );
};
export async function Sidebar({
  children,
  resume,
}: React.PropsWithChildren<{ resume: Resume }>) {
  const { resumeData } = resume;
  const { image, name, profiles } = resumeData?.basics ?? {};
  return (
    <aside className={style.sidebar}>
      <div className={style.sidebar__head}>
        {image && (
          <div className={style.image_container}>
            <Image
              className={style.image}
              width={248}
              height={248}
              src={image}
              alt={name || "Profile Image"}
            />
          </div>
        )}
        <div className={style.name}>{name}</div>

        <div className={style.sidebar__content}>
          <Contact resumeData={resumeData} hasAccess={resume.hasAccess} />
          {profiles && (
            <div id={"profiles"} className="no-print">
              {profiles.map((profile) => (
                <Profile {...profile} key={profile.network} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={style.sidebar__sections}>{children}</div>
    </aside>
  );
}
