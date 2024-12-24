import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import SearchIcon from "@rsuite/icons/Search";
import SettingHorizontalIcon from "@rsuite/icons/SettingHorizontal";
import React, { useEffect, useState } from "react";
import { Button, IconButton } from "rsuite";
import styles from "./filter.module.scss";
export default function Filter({ advanced, search, loading, ...props }) {
  const [ismobile, setismobile] = useState(true);
  const handleResize = () => {
    console.log(window && window.innerWidth <= 600);
    setismobile(window && window.innerWidth <= 600);
  };
  useEffect(() => {
    console.log(window && window.innerWidth <= 600);

    setismobile(window && window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={styles.container}>
      <div>{props.children}</div>

      <div className="p-10" style={{ width: ismobile ? "100%" : "unset" }}>
        <Button
          appearance="primary"
          color="cyan"
          onClick={() => search()}
          block={ismobile}
        >
          {loading ? (
            <SpinnerIcon pulse style={{ fontSize: "2em" }} />
          ) : (
            <>
              {" "}
              <SearchIcon /> Recherche
            </>
          )}
        </Button>{" "}
        {advanced && <IconButton icon={<SettingHorizontalIcon />} />}
      </div>
    </div>
  );
}
