"use client";

import { useStore } from "@/app/store/app-store";
import { useEffect, useState } from "react";
import { GameNotFound } from "@/app/components/GameNotFound/GameNotFound";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { getNormalizedGameDataById, isResponseOk, checkIfUserVoted, vote } from "../../api/api-utils";
import Styles from "./Game.module.css";

export default function GamePage(props) {
  const [game, setGame] = useState(null);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const authContext = useStore();

  useEffect(() => {
    async function fetchData() {
      const gameData = await getNormalizedGameDataById(endpoints.games, props.params.id);
      if (isResponseOk(gameData)) {
        setGame(gameData);
        setPreloaderVisible(false);
      } else {
        setGame(null);
        setPreloaderVisible(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (authContext.isAuth && game) {
      async function checkVote() {
        const voted = await checkIfUserVoted(game, authContext.user.id);
        setIsVoted(voted);
      }
      checkVote();
    }
  }, [authContext.isAuth, game]);

  const handleVote = async () => {
    const jwt = authContext.token
    let usersIdArray = game.users.length
      ? game.users.map((user) => user.id)
      : [];
    usersIdArray.push(authContext.user.id);
    const response = await vote(
      `${endpoints.games}/${game.id}`,
      jwt,
      usersIdArray
    );
    if (isResponseOk(response)) {
      setGame(() => {
        return {
          ...game,
          users: [...game.users, authContext.user],
        };
      });
      setIsVoted(true);
    }
  };

  if (preloaderVisible) {
    return <Preloader />;
  }

  if (!game) {
    return <GameNotFound />;
  }

  return (
    <main className="main">
      <section className={Styles["game"]}>
        <iframe className={Styles["game__iframe"]} src={game.link}></iframe>
      </section>
      <section className={Styles["about"]}>
        <h2 className={Styles["about__title"]}>{game.title}</h2>
        <div className={Styles["about__content"]}>
          <p className={Styles["about__description"]}>{game.description}</p>
          <div className={Styles["about__author"]}>
            <p>Автор: <span className={Styles["about__accent"]}>{game.developer}</span></p>
          </div>
        </div>
        <div className={Styles["about__vote"]}>
          <p className={Styles["about__vote-amount"]}>
            За игру уже проголосовали: <span className={Styles["about__accent"]}>{game.users.length}</span>
          </p>
          <button
            disabled={!authContext.isAuth || isVoted}
            className={`button ${Styles["about__vote-button"]}`}
            onClick={handleVote}
          >
            {isVoted ? "Голос учтён" : "Голосовать"}
          </button>
        </div>
      </section>
    </main>
  );
}