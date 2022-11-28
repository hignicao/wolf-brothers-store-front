import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";
import ImageSlider from "./ImageSlider";
import Product from "../../components/Product/Product";
import { UserContext } from "../../providers/UserData";
import LoginPage from "../LoginPage/LoginPage";
import Button from "../../components/Button/Button";

export default function HomePage() {
  const { userData } = useContext(UserContext);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(undefined);
  useEffect(() => {
    api
      .getProducts(page)
      .then((res) => {
        if (products === null) {
          setProducts(res.data.products);
          setTotalProducts(res.data.totalProducts);
        } else if (products !== null) {
          setProducts([...products, ...res.data.products]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  function loadMore() {
    setPage(page + 1);
  }
  if (!products) {
    return (
      <ContainerEmpty>
        <Loader />
      </ContainerEmpty>
    );
  }

  return (
    <Container>
      <div>
        <ImageSlider />
      </div>
      <p>OUR PRODUCTS</p>
      <ProductsContainer>
        {products.map((product) => (
          <Product
            key={product._id}
            imgURL={product.imgURL}
            name={product.name}
            price={product.price}
            id={product._id}
            type={product.type}
            userData={userData}
          />
        ))}
      </ProductsContainer>
      {products.length < totalProducts && (
        <Button width={"200px"} height={"50px"} onClick={loadMore}>
          Load more
        </Button>
      )}
    </Container>
  );
}

const ContainerEmpty = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40vh;
`;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 40px;
    font-style: normal;
    margin: 70px 0 40px 0;
  }
`;

const ProductsContainer = styled.section`
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 50px;
  overflow: hidden;
`;
