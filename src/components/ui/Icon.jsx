import {
  ArrowRight, Atom, Droplets, Flame, BookOpen, Boxes, Building2, ClipboardList, Cog, Compass, Factory, Feather,
  FileText, FlaskConical, Hammer, HardHat, Layers, Lightbulb, Mountain, Move, Network, Newspaper,
  Package, Palette, PenTool, Ruler, ScanSearch, Shapes, ShieldCheck, ShoppingBag, Sofa, Sparkles,
  Store, Truck, Warehouse, Wrench,
} from 'lucide-react'

const ICONS = {
  ArrowRight, Atom, Droplets, Flame, BookOpen, Boxes, Building2, ClipboardList, Cog, Compass, Factory, Feather,
  FileText, FlaskConical, Hammer, HardHat, Layers, Lightbulb, Mountain, Move, Network, Newspaper,
  Package, Palette, PenTool, Ruler, ScanSearch, Shapes, ShieldCheck, ShoppingBag, Sofa, Sparkles,
  Store, Truck, Warehouse, Wrench,
}

// Resolves icon names stored in data files to lucide components.
export default function Icon({ name, size = 22, strokeWidth = 1.25, className = '' }) {
  const C = ICONS[name] || Shapes
  return <C size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}
