import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";

const FlatsFavorites = () => {
  return (
    <>
    <div>
      <Header></Header>
            <h1>FlatsFavorites</h1>
            <FlatTable type={'favorites-flats'}/>
        </div>
    </>

  )
}

export default FlatsFavorites