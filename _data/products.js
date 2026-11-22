export const products = [
  {
    id: 'trailvault-system',
    name: 'TrailVault™ 3-Hour Alone System',
    price: 6900,
    image: '/images/4.webp',
    moduleImages: {
      tower: '/images/3.png',
      scentknot: '/images/6.webp',
      pawsle: '/images/9.webp'
    },
    description: 'One complete, modular 3-piece enrichment system engineered to cover the entire emotional and physical arc of your dog\'s 3+ hours alone.',
    modules: [
      {
        name: 'TrailVault™ Puzzle Tower',
        hours: '0:00 – 2:00',
        focus: 'Brain & Nose Drain',
        image: '/images/3.png',
        detail: 'Weighted 4-stage mechanical lock-chain tower. Scent-track base paddles, counterweight spin drum, ratchet tug lever, and top vault — one lock at a time, never brute-forced in 5 minutes.'
      },
      {
        name: 'ScentKnot™ Door-Anchor Tension Cord',
        hours: '1:30 – 2:30',
        focus: 'Physical Tug & Resistance',
        image: '/images/6.webp',
        detail: 'Clips to the TrailVault base or anchors under any closed interior door via its padded wedge. Tension-locking silicone treat pods give high-drive dogs a safe full-body tug outlet — slippers and cushions stay untouched.'
      },
      {
        name: 'Pawsle™ Nesting Freeze-Core',
        hours: '2:30 – 3:30+',
        focus: 'Calm Wind-Down',
        image: '/images/9.webp',
        detail: 'Docks into the TrailVault base or sits beside it. 3 concentric frozen broth-and-kibble rings with ribbed chew fins trigger slow, endorphin-releasing licking that transitions an exhausted dog into deep sleep.'
      }
    ]
  }
];
