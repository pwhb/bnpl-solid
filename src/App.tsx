import { For, Match, Switch, createResource, createSignal } from 'solid-js';
import './App.css';
// import json from "./data.json";

async function fetchProducts(query: string)
{
  // return json;
  const baseUrl = "https://apibranch.ayainnovation.com/bnpl/products/groupped";
  const url = `${baseUrl}?${query}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("data", data);

  return data;
}



function App()
{

  const [data] = createResource("modelActive=true&active=true&inStock=true&clientType=AYAPAY", fetchProducts);

  const [model, setModel] = createSignal("");
  const [color, setColor] = createSignal("");
  const [product, setProduct] = createSignal("");
  const getProducts = () => data() ? data()?.data : [];

  const getModel = () => getProducts()?.find((product: { model: { _id: string; }; }) => product.model._id === model());

  const getProductInfos = () => getModel()?.products.map((product: { productInfo: any; }) => product.productInfo);

  const getColors = () => getModel()?.products[0].productInfo.availableColors;

  const getColoredImgs = () =>
  {
    if (getColors())
    {
      if (!color())
      {
        return getColors()![0].images;
      }
      for (let obj of getColors()!)
      {
        if (obj.code === color())
        {
          return obj.images;
        } getProducts()?.find((product: { products: any[]; }) => product.products.map((obj: { productInfo: any; }) => obj.productInfo));
      }
    }
  };


  const getProduct = () =>
    getProductInfos()?.find((productInfo: { _id: string; }) => productInfo._id === product());



  return (
    <>
      <h1 class="text-3xl font-bold mb-3 text-red-500">
        Buy Now Pay Later
      </h1>
      <Switch fallback={<span class="loading loading-infinity loading-lg"></span>}>
        <Match when={model()}>
          <div class='w-full'>
            <div class="carousel carousel-center rounded-box w-48 md:w-96">
              <For each={getColoredImgs()}>
                {(img) =>
                  <div class="carousel-item">
                    <img src={img.value} class='h-48' />
                  </div>
                }
              </For>
            </div>

            <div class='my-3'>
              <p class='text-xl font-bold'>{getProduct()?.model.name}</p>
              <p class='text-xl'>{getProduct()?.rrp} MMK</p>
            </div>
            <div class='flex flex-row justify-center gap-5 my-10'>
              <For each={getProductInfos()}>
                {(productInfo) =>
                  <div>
                    <button class='btn' onClick={() => setProduct(productInfo._id)
                    }>
                      {productInfo.specification}
                    </button>

                  </div>
                }
              </For>
            </div>
            <div class='flex flex-row justify-center gap-5'>
              <For each={getColors()}>
                {(color) =>
                  <div>
                    <button class='btn' style={`background-color: ${color.code}`} onClick={() => setColor(color.code)}>
                    </button>
                    <p class='text-xs font-medium'>{color.label}</p>
                  </div>
                }
              </For>
            </div>

            <button class='btn mt-5' onClick={() => setModel("")}>back</button>
          </div>
        </Match >
        <Match when={data()}>
          <div class='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3'>

            <For each={getProducts()}>
              {(product) =>
                <div class='grid'>
                  <button class='hover:scale-110 border-0' onClick={() =>
                  {
                    setModel(product.model._id);
                    setColor(product.products[0].productInfo.availableColors[0].code);
                    setProduct(product.products[0].productInfo._id);
                  }}>
                    <div class="card bg-base-100 shadow-md  mb-2">
                      <img src={product.products[0].productInfo.defaultImg} />

                    </div>
                    <p class='font-semibold text-sm'>{product.model.name}</p>
                    <p class='text-xs'>From {product.products[0].offerPrice}</p>
                  </button>
                </div>}
            </For>
          </div>
        </Match>
      </Switch >
    </>
  );
}

export default App;
