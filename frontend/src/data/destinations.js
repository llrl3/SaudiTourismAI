export const destinations = [
  {
    id: "jeddah",
    name: { ar: "جدة", en: "Jeddah" },
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    image: "https://images.unsplash.com/photo-1785087363369-f07860094165?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    desc: {
      ar: "جدة عروس البحر الأحمر وواحدة من أهم المدن الساحلية في المملكة، تشتهر بتاريخها العريق وواجهة البحر الجميلة وتنوعها الثقافي.",
      en: "Jeddah, the Bride of the Red Sea, is one of Saudi Arabia's most important coastal cities, known for its rich history, beautiful waterfront and cultural diversity.",
    },
    attractions: {
      ar: ["البلد التاريخية", "كورنيش جدة", "نافورة الملك فهد", "الواجهة البحرية"],
      en: ["Al-Balad Old Town", "Jeddah Corniche", "King Fahd Fountain", "The Waterfront"],
    },
    activities: {
      ar: ["الغوص في البحر الأحمر", "التسوق في البلد", "جولة بحرية عند الغروب"],
      en: ["Red Sea diving", "Shopping in Al-Balad", "Sunset boat tour"],
    },
    duration: { ar: "3 - 4 أيام", en: "3 - 4 days" },
  },

  {
    id: "riyadh",
    name: { ar: "الرياض", en: "Riyadh" },
    region: { ar: "منطقة الرياض", en: "Riyadh Region" },
    image: "https://images.unsplash.com/photo-1780657432436-58c4fefcde41?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    desc: {
      ar: "الرياض عاصمة المملكة العربية السعودية وأكبر مدنها، تجمع بين التطور الحضري والمعالم الحديثة والتراث النجدي الأصيل.",
      en: "Riyadh is the capital and largest city of Saudi Arabia, blending modern urban development, iconic landmarks and authentic Najdi heritage.",
    },
    attractions: {
      ar: ["برج المملكة", "الدرعية التاريخية", "بوليفارد رياض سيتي", "حافة العالم"],
      en: ["Kingdom Tower", "Historic Diriyah", "Riyadh Boulevard", "Edge of the World"],
    },
    activities: {
      ar: ["مشاهدة المدينة من السكاي بريدج", "زيارة الدرعية", "رحلة صحراوية"],
      en: ["City view from Sky Bridge", "Visit Diriyah", "Desert trip"],
    },
    duration: { ar: "3 - 5 أيام", en: "3 - 5 days" },
  },

  {
    id: "alula",
    name: { ar: "العلا", en: "AlUla" },
    region: { ar: "منطقة المدينة المنورة", en: "Madinah Region" },
    image: "https://images.unsplash.com/photo-1734572410061-7823529c93f7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    desc: {
      ar: "العلا وجهة تاريخية وسياحية مميزة في شمال غرب المملكة، تشتهر بمدائن صالح وتشكيلاتها الصخرية الرائعة وآثارها العريقة.",
      en: "AlUla is a remarkable historical and tourist destination in northwestern Saudi Arabia, famous for Hegra, stunning rock formations and ancient heritage.",
    },
    attractions: {
      ar: ["مدائن صالح (الحِجر)", "صخرة الفيل", "البلدة القديمة", "جبل عكمة"],
      en: ["Hegra (Madain Salih)", "Elephant Rock", "Old Town", "Jabal Ikmah"],
    },
    activities: {
      ar: ["جولة أثرية في الحِجر", "منطاد الهواء الساخن", "تجربة النجوم في الصحراء"],
      en: ["Heritage tour of Hegra", "Hot air balloon", "Stargazing in the desert"],
    },
    duration: { ar: "2 - 3 أيام", en: "2 - 3 days" },
  },

  {
    id: "makkah",
    name: { ar: "مكة", en: "Makkah" },
    region: { ar: "منطقة مكة المكرمة", en: "Makkah Region" },
    image: "https://images.unsplash.com/photo-1592326871020-04f58c1a52f3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    desc: {
      ar: "مكة المكرمة أقدس مدن المسلمين، وتحتضن المسجد الحرام والكعبة المشرفة، وتستقبل ملايين الزوار من مختلف أنحاء العالم.",
      en: "Makkah is the holiest city in Islam, home to the Grand Mosque and the Holy Kaaba, welcoming millions of visitors from around the world.",
    },
    attractions: {
      ar: ["المسجد الحرام", "الكعبة المشرفة", "جبل النور", "برج الساعة"],
      en: ["The Grand Mosque", "The Holy Kaaba", "Mount Nour", "Clock Tower"],
    },
    activities: {
      ar: ["أداء العمرة", "زيارة المعالم التاريخية", "التسوق في الأبراج"],
      en: ["Perform Umrah", "Visit historic landmarks", "Shopping at the towers"],
    },
    duration: { ar: "2 - 4 أيام", en: "2 - 4 days" },
  },

  {
    id: "madinah",
    name: { ar: "المدينة", en: "Madinah" },
    region: { ar: "منطقة المدينة المنورة", en: "Madinah Region" },
    image: "https://images.unsplash.com/photo-1692977579997-948328cdb7d2?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    desc: {
      ar: "المدينة المنورة مدينة ذات مكانة إسلامية عظيمة، تحتضن المسجد النبوي الشريف وتتميز بأجوائها الهادئة ومعالمها التاريخية.",
      en: "Madinah is a city of great Islamic significance, home to the Prophet's Mosque and known for its peaceful atmosphere and historic landmarks.",
    },
    attractions: {
      ar: ["المسجد النبوي", "مسجد قباء", "جبل أحد", "مقابر البقيع"],
      en: ["Prophet's Mosque", "Quba Mosque", "Mount Uhud", "Al-Baqi Cemetery"],
    },
    activities: {
      ar: ["الصلاة في المسجد النبوي", "زيارة المعالم الإسلامية", "جولة تاريخية"],
      en: ["Pray at the Prophet's Mosque", "Visit Islamic sites", "Historic tour"],
    },
    duration: { ar: "2 - 3 أيام", en: "2 - 3 days" },
  },

  {
    id: "abha",
    name: { ar: "أبها", en: "Abha" },
    region: { ar: "منطقة عسير", en: "Asir Region" },
    image: "https://images.pexels.com/photos/36772107/pexels-photo-36772107.jpeg?auto=compress&cs=tinysrgb&w=1200",
    desc: {
      ar: "أبها عروس الجبل وعاصمة منطقة عسير، تتميز بجبالها الخضراء وأجوائها المعتدلة وطبيعتها الخلابة وقراها التراثية.",
      en: "Abha, the Bride of the Mountains and capital of Asir Region, is known for its green mountains, mild climate, beautiful nature and heritage villages.",
    },
    attractions: {
      ar: ["جبل السودة", "قرية رجال ألمع", "منتزه عسير", "تلفريك أبها"],
      en: ["Jabal Soudah", "Rijal Almaa Village", "Asir Park", "Abha Cable Car"],
    },
    activities: {
      ar: ["ركوب التلفريك", "التنزه بين الجبال", "زيارة القرى التراثية"],
      en: ["Cable car ride", "Mountain hiking", "Visit heritage villages"],
    },
    duration: { ar: "3 - 4 أيام", en: "3 - 4 days" },
  },
];

export const getDestination = (id) =>
  destinations.find((d) => d.id === id);