import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

// Home ships in the main bundle; every other route is code-split.
const About = lazy(() => import('./pages/About'))
const Manufacturing = lazy(() => import('./pages/Manufacturing'))
const Innovation = lazy(() => import('./pages/Innovation'))
const Products = lazy(() => import('./pages/Products'))
const RangePage = lazy(() => import('./pages/RangePage'))
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Applications = lazy(() => import('./pages/Applications'))
const Projects = lazy(() => import('./pages/Projects'))
const Partners = lazy(() => import('./pages/Partners'))
const Resources = lazy(() => import('./pages/Resources'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/manufacturing" element={<Manufacturing />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:range" element={<RangePage />} />
        <Route path="/products/:range/:collection" element={<CollectionPage />} />
        <Route path="/products/:range/:collection/:product" element={<ProductPage />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
