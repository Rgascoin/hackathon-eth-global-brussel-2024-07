import dynamic from 'next/dynamic';
import React from 'react';

import Layout from '@/components/Layout';

const DashboardSafe = dynamic(() => import('../components/Dashboard/Dasboard'), {
	ssr: false,
});

function HomePage() {
	return (
		<Layout>
			<DashboardSafe />
		</Layout>
	);
}

export default HomePage;
