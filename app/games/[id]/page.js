"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/app/store/app-store";

export default function GamePage(props) {
  const [game, setGame] = useState(null);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const authContext = useStore();

  useEffect(() => {
    authContext.checkAuth();
    async function fetchData() {
      const game = await getNormalizedGameDataById(
        endpoints.games,
        props.params.id
      );
      isResponseOk(game) ? setGame(game) : setGame(null);
      setPreloaderVisible(false);
    }
    fetchData();
<<<<<<< HEAD
<<<<<<< HEAD
  }, [props.params.id, authContext]);

=======
  }, []);
  
>>>>>>> parent of 379b1b7 (1)
=======
  }, []);
  
>>>>>>> parent of 379b1b7 (1)
  useEffect(() => {
    authContext.user && game ? setIsVoted(checkIfUserVoted(game, authContext.user.id)) : setIsVoted(false);
  }, [authContext.user, game]);

  const handleVote = async () => {
    const jwt = authContext.token
    let usersIdArray = game.users.length
      ? game.users.map((user) => user.id)
      : [];
    usersIdArray.push(authContext.user.id);
    const response = await vote(
      `${endpoints.games}/${game.id}`,
      jwt,
      { users: usersIdArray }
    );
    if (isResponseOk(response)) {
<<<<<<< HEAD
<<<<<<< HEAD
      setGame((prevGame) => ({
        ...prevGame,
        users: [...prevGame.users, authContext.user],
      }));
=======
=======
>>>>>>> parent of 379b1b7 (1)
      setGame(() => {
        return {
          ...game,
          users: [...game.users, authContext.user],
        };
      });
>>>>>>> parent of 379b1b7 (1)
      setIsVoted(true);
    }
  };

  return (
    <main className="main">
      {game ? (
        <>
          <section className={Styles["game"]}>
            <iframe className={Styles["game__iframe"]} src={game.link}></iframe>
          </section>
          <section className={Styles["about"]}>
            <h2 className={Styles["about__title"]}>{game.title}</h2>
            <div className={Styles["about__content"]}>
              <p className={Styles["about__description"]}>{game.description}</p>
              <div className={Styles["about__author"]}>
                <p>
                  Автор:{" "}
                  <span className={Styles["about__accent"]}>
                    {game.developer}
                  </span>
                </p>
              </div>
            </div>
            <div className={Styles["about__vote"]}>
              <p className={Styles["about__vote-amount"]}>
                За игру уже проголосовали:{" "}
                <span className={Styles["about__accent"]}>
                  {game.users.length}
                </span>
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
        </>
      ) : preloaderVisible ? (
        <Preloader />
      ) : (
        <GameNotFound />
      )}
    </main>
  );
}
