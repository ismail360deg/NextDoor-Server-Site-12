import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../Loading/Loading';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

const MyProducts = () => {

    const [deletingProduct, setDeletingProduct] = useState(null);

    const closeModal = () => {
        setDeletingProduct(null);
    }

    const { data: myProducts, isLoading, refetch } = useQuery({
        queryKey: ['myProducts'],
        queryFn: async () => {
            try {
                const res = await fetch('http://localhost:5000/myProducts', {
                    headers: {
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    }
                })
                const data = await res.json();
                return data;
            }
            catch (error) {

            }
        }
    });

    const handleDeleteProduct = product => {
        fetch(`http://localhost:5000/myProducts/${product._id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    refetch();
                    toast.success(`Product ${product.name} deleted successfully`)
                }

            })
    }

    if (isLoading) {
        return <Loading></Loading>
    }

    return (
        <div>
            <h2 className="text-3xl">My Products: {myProducts?.length}</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className=''>
                            <th></th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Condition</th>
                            <th>Number</th>
                            <th>Location</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            myProducts.map((product, i) => <tr key={product._id}>
                                <th>{i + 1}</th>
                                <td><div className="avatar">
                                    <div className="w-24 rounded-full">
                                        <img src={product.image} alt="" />
                                    </div>
                                </div></td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.condition}</td>
                                <td>{product.number}</td>
                                <td>{product.location}</td>
                                <td>
                                    <label onClick={() => setDeletingProduct(product)} htmlFor="confirmation-modal" className="btn btn-sm bg-red-600 border-none">Delete</label>
                                </td>
                                <td>
                                    <button className="btn btn-sm border-none bg-lime-600">Advertised</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
            {
                deletingProduct && <ConfirmationModal
                    title={`Are you sure you want to delete?`}
                    message={`If you delete ${deletingProduct.name}. It cannot be undone.`}
                    successAction={handleDeleteProduct}
                    successButtonName="Delete"
                    modalData={deletingProduct}
                    closeModal={closeModal}
                >
                </ConfirmationModal>
            }
        </div>
    );
};

export default MyProducts;