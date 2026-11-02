import React from 'react';
import Layout from './components/nguoiban/Layout';
import QuanLyTin from './components/nguoiban/QuanLyTin';
import FormTin from './components/nguoiban/FormTin';
import DonHangCanXuLy from './components/nguoiban/DonHangCanXuLy';

// Chuyển giữa 3 màn hình bằng state (chưa cần react-router)
class App extends React.Component {
  state = { man: 'tin', idSua: null };

  // onNav('form', id) -> sửa tin; onNav('form') -> đăng tin mới
  onNav = (man, idSua = null) => this.setState({ man, idSua });

  render() {
    const { man, idSua } = this.state;
    const active = man === 'form' && idSua ? '' : man; // đang sửa tin thì không tô menu nào
    return (
      <Layout active={active} onNav={this.onNav}>
        {man === 'tin' && <QuanLyTin onNav={this.onNav} />}
        {man === 'form' && <FormTin key={idSua || 'moi'} idSua={idSua} onNav={this.onNav} />}
        {man === 'donhang' && <DonHangCanXuLy />}
      </Layout>
    );
  }
}

export default App;
