import React from 'react';

export const ProductHuntBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a 
        href="https://www.producthunt.com/posts/inspire-daily?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-inspire&#0045;daily" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img 
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=707820&theme=light" 
          alt="Inspire Daily - Votre inspiration quotidienne pour les réseaux sociaux | Product Hunt" 
          width="250" 
          height="54" 
          className="w-[250px] h-[54px]"
        />
      </a>
    </div>
  );
};