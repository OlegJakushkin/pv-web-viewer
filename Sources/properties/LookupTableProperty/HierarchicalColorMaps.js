import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json';

// create categories
const Categories = Object.create(null);
['ERDC', 'Rainbow', 'Matlab', 'NIC', 'Haze', 'matplotlib'].forEach((cat) => {
  Categories[cat] = [];
});

const Uncategorized = [];

function unique(arr) {
  const seen = Object.create(null);
  return arr.filter((i) => {
    if (seen[i.Name]) {
      return false;
    }
    seen[i.Name] = true;
    return true;
  });
}

/* eslint-disable dot-notation */
unique(
  vtkColorMaps
    .filter((p) => p.RGBPoints)
    .filter((p) => p.ColorSpace !== 'CIELAB')
).forEach((preset) => {
  if (/^erdc_/i.test(preset.Name)) {
    Categories['ERDC'].push(preset);
  } else if (/Rainbow/i.test(preset.Name)) {
    // should be after erdc, since erdc has some rainbow
    Categories['Rainbow'].push(preset);
  } else if (/_Matlab$/i.test(preset.Name)) {
    Categories['Matlab'].push(preset);
  } else if (/^nic_/i.test(preset.Name)) {
    Categories['NIC'].push(preset);
  } else if (/^Haze/i.test(preset.Name)) {
    Categories['Haze'].push(preset);
  } else if (/\(matplotlib\)/i.test(preset.Name)) {
    Categories['matplotlib'].push(preset);
  } else {
    Uncategorized.push(preset);
  }
});

function comparator(a, b) {
  const s1 = a.Name.toLowerCase();
  const s2 = b.Name.toLowerCase();
  return s1 > s2 ? 1 : -(s1 < s2);
}

// sort case-insensitively
Object.keys(Categories).forEach((cat) => Categories[cat].sort(comparator));
Uncategorized.sort(comparator);

const tree = [].concat(
  Object.keys(Categories)
    .map((cat) => ({
      Name: cat,
      Category: true,
      Children: Categories[cat],
    }))
    .sort(comparator),
  Uncategorized
);

export default {
  tree,
};
