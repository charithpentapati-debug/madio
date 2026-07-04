import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MadioLayout } from "./layouts/MadioLayout";
import { MapLayout } from "./layouts/MapLayout";
import { DWLayout } from "./layouts/DWLayout";
import { FurnitureLayout } from "./layouts/FurnitureLayout";
import { MadioHome } from "./pages/MadioHome";
import { FurnitureLanding } from "./pages/FurnitureLanding";
import { FurnitureCategoryPage } from "./pages/FurnitureCategoryPage";
import { FurnitureProductDetail } from "./pages/FurnitureProductDetail";
import { DoorsWindows } from "./pages/DoorsWindows";
import { DoorsWindowsDetail } from "./pages/DoorsWindowsDetail";
import { MadioContact } from "./pages/MadioContact";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Products } from "./pages/Products";
import { TextureGallery } from "./pages/TextureGallery";
import { ColorCollections } from "./pages/ColorCollections";
import { RequestQuote } from "./pages/RequestQuote";
import { Contact } from "./pages/Contact";
import { Stencils } from "./pages/Stencils";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* MADIO umbrella routes (home + contact share the MADIO header/footer) */}
      <Route element={<MadioLayout />}>
        <Route index element={<MadioHome />} />
        <Route path="contact" element={<MadioContact />} />
      </Route>

      {/* MADIO Furniture vertical — own layout with compound MADIO/Furniture header */}
      <Route path="furniture" element={<FurnitureLayout />}>
        <Route index element={<FurnitureLanding />} />
        <Route path=":category" element={<FurnitureCategoryPage />} />
        <Route path=":category/:productId" element={<FurnitureProductDetail />} />
      </Route>

      {/* MADIO Doors & Windows vertical — own layout with D&W logo header */}
      <Route path="doors-windows" element={<DWLayout />}>
        <Route index element={<DoorsWindows />} />
        <Route path=":productId" element={<DoorsWindowsDetail />} />
      </Route>

      {/* MAP vertical routes */}
      <Route path="map" element={<MapLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="gallery" element={<TextureGallery />} />
        <Route path="colors" element={<ColorCollections />} />
        <Route path="quote" element={<RequestQuote />} />
        <Route path="contact" element={<Contact />} />
        <Route path="stencils" element={<Stencils />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
