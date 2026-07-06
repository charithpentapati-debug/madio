import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MadioLayout } from "./layouts/MadioLayout";
import { FurnitureLanding } from "./pages/FurnitureLanding";
import { FurnitureCategoryPage } from "./pages/FurnitureCategoryPage";
import { FurnitureProductDetail } from "./pages/FurnitureProductDetail";
import { DoorsWindows } from "./pages/DoorsWindows";
import { DoorsWindowsDetail } from "./pages/DoorsWindowsDetail";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Products } from "./pages/Products";
import { TextureGallery } from "./pages/TextureGallery";
import { ColorCollections } from "./pages/ColorCollections";
import { Contact } from "./pages/Contact";
import { Stencils } from "./pages/Stencils";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* All pages share the unified MAP-themed header/footer */}
      <Route element={<MadioLayout />}>
        {/* Flagship Furniture Homepage */}
        <Route index element={<FurnitureLanding />} />
        
        {/* Contact Page */}
        <Route path="contact" element={<Contact />} />

        {/* Furniture Subpages */}
        <Route path="furniture">
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":category" element={<FurnitureCategoryPage />} />
          <Route path=":category/:productId" element={<FurnitureProductDetail />} />
        </Route>

        {/* Doors & Windows vertical routes */}
        <Route path="doors-windows">
          <Route index element={<DoorsWindows />} />
          <Route path=":productId" element={<DoorsWindowsDetail />} />
        </Route>

        {/* MAP vertical routes */}
        <Route path="map">
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="gallery" element={<TextureGallery />} />
          <Route path="colors" element={<ColorCollections />} />
          <Route path="quote" element={<Navigate to="/contact?source=map" replace />} />
          <Route path="contact" element={<Navigate to="/contact?source=map" replace />} />
          <Route path="stencils" element={<Stencils />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
