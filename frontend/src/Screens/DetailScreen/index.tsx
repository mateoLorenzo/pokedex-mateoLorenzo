import "./styles.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { PokemonDetail } from "../../Entities/PokemonDetail";
import { PokemonQuickView } from "../../Entities/PokemonQuickView";
import questionMark from "../../Assets/questionMark.png";
import transparentPokeball from "../../Assets/transparentPokeball.svg";

const PokemonDetailScreen = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail>();
  const [selectedPokemonQuickView, setSelectedPokemonQuickView] =
    useState<PokemonQuickView>();
  const [loadingPokemonDetail, setLoadingPokemonDetail] =
    useState<boolean>(false);
  const actualPage: any = useLocation();
  const history = useHistory();

  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  console.log(screenWidth);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPokemonDetail(true);
        const pokemonDetailResponse = await getPokemonDetail();
        setSelectedPokemon(pokemonDetailResponse);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingPokemonDetail(false);
      }
    })();
  }, []);

  const getPokemonQuickViewDetails = (): {
    height: number;
    id: number;
    image: string;
    name: string;
    types: string[];
    weight: number;
  } => {
    const pokemonQuickViewDetails: PokemonQuickView =
      actualPage.state.pokemonQuickViewDetails;
    setSelectedPokemonQuickView(pokemonQuickViewDetails);
    return {
      height: pokemonQuickViewDetails.height,
      id: pokemonQuickViewDetails.id,
      image: pokemonQuickViewDetails.image,
      name: pokemonQuickViewDetails.name,
      types: pokemonQuickViewDetails.types,
      weight: pokemonQuickViewDetails.weight,
    };
  };

  const getPokemonDetail = async (): Promise<PokemonDetail> => {
    const { height, id, image, name, types, weight } =
      getPokemonQuickViewDetails();
    const { description, gender, habitat } = await fetchPokemonDetail(id);
    return new PokemonDetail(
      image,
      name,
      id,
      types,
      Math.trunc(height),
      Math.trunc(weight),
      `"${description}"`,
      gender,
      habitat
    );
  };

  const fetchPokemonDetail = async (
    pokemonId: number
  ): Promise<{ description: string; gender: string; habitat: string }> => {
    const response = await axios.get(`http://localhost:3001/pokemons/detail/`, {
      params: { id: pokemonId },
    });
    return {
      description: response.data.description,
      gender: response.data.gender,
      habitat: response.data.habitat,
    };
  };

  return (
    <>
      {loadingPokemonDetail && (
        <div className="mainScreenLoaderContainer">
          <div className="mainHomeLoader"></div>
        </div>
      )}
      <div className="detailScreenMainContainer">
        <div className="detailScreenSubContainer">
          <div
            className="goBackButtonContainer"
            onClick={() => history.push("/")}
          >
            <HiOutlineArrowSmLeft size={30} />
            <h3>Back</h3>
          </div>
          <div className="detailScreenContentContainer">
            <div className="detailScreenLeftCardContainer">
              <div
                style={{
                  backgroundImage: `url(${
                    selectedPokemonQuickView?.image
                      ? selectedPokemonQuickView?.image
                      : questionMark
                  })`,
                }}
                className="pokemonDetailImage"
              />
              <h1
                className="pokemonDetailName"
                data-testid="detail-screen-pokemon-name"
              >
                {selectedPokemonQuickView?.name}{" "}
              </h1>
              <div className="leftBlockFirstPokemonDetails">
                <p className="pokemonDetail-description">
                  {selectedPokemon?.description}
                </p>
              </div>
              <div className="leftBlockDetailsContainer">
                <div className="leftBlock-pokemonId">
                  <p className="pokemonDetail-id">
                    N.º
                    {selectedPokemonQuickView?.id.toString().padStart(3, "0")}
                  </p>
                </div>
                <div className="leftBlock-PokemonTypesContainer">
                  {selectedPokemonQuickView?.types.map((pokemonType, index) => {
                    return (
                      <div key={index} className="leftBlock-pokemonType">
                        <p className="pokemonDetail-PokemonTypeText">
                          {pokemonType}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="detailScreenRightCardContainer">
              <div className="detailScreenRightCardSubContainer">
                {/* <div style={{ width: 100, height: 100, background: "blue" }} /> */}
                {/* <div css={testStyle} /> */}
                <img
                  src={transparentPokeball}
                  alt="transparent-pokeball"
                  className="pokemonDetailTransparentPokeball"
                />
                <div className="pokemonPropertyBlockContainer">
                  <div className="pokemonPropertyBlockSubContainer">
                    <p className="pokemonDetailProperty">Height</p>
                    <p className="pokemonDetailValue">
                      {selectedPokemon?.height.toFixed(2)}
                    </p>
                  </div>
                  <div className="propertyDivisor"></div>
                </div>

                <div className="pokemonPropertyBlockContainer">
                  <div className="pokemonPropertyBlockSubContainer">
                    <p className="pokemonDetailProperty">Weight</p>
                    <p className="pokemonDetailValue">
                      {selectedPokemon?.weight.toFixed(2)}
                    </p>
                  </div>
                  <div className="propertyDivisor"></div>
                </div>

                <div className="pokemonPropertyBlockContainer">
                  <div className="pokemonPropertyBlockSubContainer">
                    <p className="pokemonDetailProperty">Gender</p>
                    <p className="pokemonDetailValue">
                      {selectedPokemon?.gender}
                    </p>
                  </div>
                  <div className="propertyDivisor"></div>
                </div>

                <div className="pokemonPropertyBlockContainer">
                  <div className="pokemonPropertyBlockSubContainer">
                    <p className="pokemonDetailProperty">Habitat</p>
                    <p className="pokemonDetailValue">
                      {selectedPokemon?.habitat}
                    </p>
                  </div>
                  <div className="propertyDivisor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonDetailScreen;
